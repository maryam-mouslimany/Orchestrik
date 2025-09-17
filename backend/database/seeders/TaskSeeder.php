<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Task;
use Carbon\Carbon;

class TaskSeeder extends Seeder
{
    private int $MIN_TASKS_PER_PROJECT = 15;
    private int $MAX_TASKS_PER_PROJECT = 30;

    // Priority distribution
    private array $PRIORITY_WEIGHTS = [
        'low'    => 20,
        'medium' => 55,
        'high'   => 25,
    ];

    // PM candidates (must be members)
    private array $PM_IDS = [2, 3, 4];

    public function run(): void
    {
        // Optional resets:
        // \App\Models\TaskStatusLog::truncate();
        // Task::truncate();

        // Eager-load members (Eloquent only)
        $projects = Project::with('members:id')
            ->select('id', 'created_at')
            ->get();

        foreach ($projects as $project) {
            $memberIds = $project->members->pluck('id')->all();
            if (empty($memberIds)) continue;

            // Choose a PM that is a member (or fallback to any member)
            $pmForProject = $this->pickPmForProject($memberIds);

            $count = random_int($this->MIN_TASKS_PER_PROJECT, $this->MAX_TASKS_PER_PROJECT);
            $createdTasks = [];

            // 1) Create tasks only in pending / in progress
            for ($i = 0; $i < $count; $i++) {
                $createdAt    = $this->randomCreatedAt($project->created_at);
                $deadlineDate = (clone $createdAt)->addDays(random_int(2, 45))->startOfDay(); // DATE-only
                $priority     = $this->pickWeighted($this->PRIORITY_WEIGHTS);
                $assigneeId   = $this->pickAssignee($memberIds, $pmForProject);

                // Start status: pending OR in progress
                $startStatus = (random_int(1, 100) <= 50) ? 'pending' : 'in progress';

                /** @var Task $task */
                $task = Task::create([
                    'title'              => $this->fakeTitle(),
                    'description'        => $this->fakeDescription(),
                    'created_by'         => $pmForProject,
                    'assigned_to'        => $assigneeId,
                    'priority'           => $priority,
                    'deadline'           => $deadlineDate->toDateString(), // <-- DATE ONLY
                    'status'             => $startStatus,
                    'project_id'         => $project->id,
                    'estimated_duration' => random_int(1, 10),
                    'created_at'         => $createdAt,
                    'updated_at'         => $createdAt,
                ]);

                // NOTE: Per your requirement, we DO NOT log 'pending -> in progress' at creation time.
                $createdTasks[] = $task;
            }

            // 2) ~60% complete (75% on time, 25% overdue by up to 4 days)
            $toComplete = collect($createdTasks)->shuffle()->take((int) floor($count * 0.6));
            foreach ($toComplete as $task) {
                $assigneeId = $task->assigned_to;
                $lastTs = $task->statusLogs()->latest('created_at')->value('created_at') ?? $task->created_at;

                // Ensure the task is in progress before completing, but DO NOT log that transition.
                if ($task->status === 'pending') {
                    $ts = $this->tick($lastTs);
                    $task->status     = 'in progress';
                    $task->updated_at = $ts;
                    $task->save();
                    $lastTs = $ts;
                }

                // Date-only deadline comparison
                $deadlineDate = $task->deadline instanceof Carbon
                    ? $task->deadline
                    : Carbon::parse($task->deadline);

                $deadlineEnd = (clone $deadlineDate)->endOfDay();

                $onTime = (random_int(1, 100) <= 75); // 75% on time
                if ($onTime) {
                    $completionAt = $this->tick($lastTs);
                    if ($completionAt->gt($deadlineEnd)) {
                        $completionAt = (clone $deadlineEnd)->subHours(random_int(1, 8));
                    }
                } else {
                    // overdue by 1–4 days, daytime
                    $completionAt = (clone $deadlineEnd)
                        ->addDays(random_int(1, 4))
                        ->setTime(random_int(9, 18), random_int(0, 59));
                }

                // LOG ONLY: ... -> completed (required note + duration)
                $task->statusLogs()->create([
                    'from_status' => 'in progress',
                    'to_status'   => 'completed',
                    'changed_by'  => $assigneeId,
                    'note'        => $this->completionNote(),  // required
                    'duration'    => $this->quarterDuration(), // required (.25/.5/.75)
                    'created_at'  => $completionAt,
                    'updated_at'  => $completionAt,
                ]);

                $task->status     = 'completed';
                $task->updated_at = $completionAt;
                $task->save();
            }

            // 3) From the COMPLETED subset, ~20% reopened (note required, no duration)
            $completed = collect($createdTasks)->filter(fn($t) => $t->status === 'completed');
            $reopenCount = (int) floor($completed->count() * 0.2);
            if ($reopenCount > 0) {
                $toReopen = $completed->shuffle()->take($reopenCount);

                foreach ($toReopen as $task) {
                    // Find the completion timestamp to keep timeline consistent
                    $completionAt = $task->statusLogs()
                        ->where('to_status', 'completed')
                        ->latest('created_at')
                        ->value('created_at') ?? $task->updated_at;

                    $reopenAt = $this->tick($completionAt);

                    // LOG ONLY: completed -> reopened (required note)
                    $task->statusLogs()->create([
                        'from_status' => 'completed',            // IMPORTANT: from completed
                        'to_status'   => 'reopened',
                        'changed_by'  => $pmForProject,          // PM reopens
                        'note'        => $this->reopenReason(),  // required
                        'duration'    => null,                   // only required for completed
                        'created_at'  => $reopenAt,
                        'updated_at'  => $reopenAt,
                    ]);

                    $task->status     = 'reopened';
                    $task->updated_at = $reopenAt;
                    $task->save();
                }

                $openTasks   = collect($createdTasks)->filter(fn($t) => in_array($t->status, ['pending', 'in progress', 'reopened']));
                $targetCount = (int) floor($openTasks->count() * 0.2); 
                if ($targetCount > 0) {
                    $today      = Carbon::today();
                    $toOverdue  = $openTasks->shuffle()->take($targetCount);

                    foreach ($toOverdue as $task) {
                        $task->deadline = $today->copy()->subDays(random_int(1, 4))->toDateString(); 
                        $task->save(); 
                    }
                }
            }
        }
    }

    // ---------------- helpers (all Eloquent-friendly) ----------------

    private function pickPmForProject(array $memberIds): int
    {
        $eligible = array_values(array_intersect($this->PM_IDS, $memberIds));
        return $eligible ? $eligible[array_rand($eligible)] : $memberIds[array_rand($memberIds)];
    }

    private function pickAssignee(array $memberIds, int $pmId): int
    {
        $pool = array_values(array_diff($memberIds, [$pmId]));
        if (empty($pool)) $pool = $memberIds;
        return $pool[array_rand($pool)];
    }

    private function pickWeighted(array $weights)
    {
        $sum = array_sum($weights);
        $r = random_int(1, $sum);
        $acc = 0;
        foreach ($weights as $key => $w) {
            $acc += $w;
            if ($r <= $acc) return $key;
        }
        return array_key_first($weights);
    }

    private function randomCreatedAt($projectCreatedAt): Carbon
    {
        $base = $projectCreatedAt ? Carbon::parse($projectCreatedAt) : Carbon::now()->subMonths(6);
        return $base->copy()->addDays(random_int(0, 120))->setTime(random_int(9, 18), random_int(0, 59));
    }

    private function tick(Carbon $t): Carbon
    {
        // advance 1–3 days within working hours
        return $t->copy()->addDays(random_int(1, 3))->setTime(random_int(9, 18), random_int(0, 59));
    }

    private function quarterDuration(): float
    {
        // integer base + one of .25/.5/.75; max 2 decimals
        $base = random_int(1, 8);
        $fractions = [0.25, 0.5, 0.75];
        return round($base + $fractions[array_rand($fractions)], 2);
    }

    private function completionNote(): string
    {
        $notes = [
            'All acceptance criteria met. Assets uploaded.',
            'Approved by PM. Final export attached.',
            'Client feedback addressed. Marking as done.',
            'QA passed. Handing over to publishing.',
        ];
        return $notes[array_rand($notes)];
    }

    private function reopenReason(): string
    {
        $reasons = [
            'Client requested revisions on copy and visuals.',
            'Branding inconsistency found; needs rework.',
            'Performance below target; adjust and retry.',
            'Missing legal disclaimer; update required.',
            'Specs mismatch; revise dimensions.',
        ];
        return 'PM Reopen: ' . $reasons[array_rand($reasons)];
    }

    private function fakeTitle(): string
    {
        $verbs = ['Draft', 'Design', 'Shoot', 'Edit', 'Review', 'Optimize', 'Publish', 'QA', 'Brief', 'Storyboard'];
        $items = ['Reel', 'Static Post', 'Carousel', 'Landing Page', 'Ad Set', 'Campaign', 'Storyboard', 'Logo Variations', 'Billboard Mock'];
        $topic = ['Autumn', 'Holiday', 'New Product', 'Awareness', 'Engagement', 'Retargeting', 'UGC', 'Event Teaser'];
        return "{$verbs[array_rand($verbs)]} {$items[array_rand($items)]} – {$topic[array_rand($topic)]}";
    }

    private function fakeDescription(): string
    {
        $bits = [
            'Include brand-safe copy and CTA.',
            'Follow the style guide and export in required sizes.',
            'Coordinate with PM for stakeholder review.',
            'Use latest assets from the shared drive.',
            'A/B test two versions where applicable.',
            'Tag assets correctly for handoff.',
        ];
        shuffle($bits);
        return implode(' ', array_slice($bits, 0, random_int(2, 4)));
    }
}
