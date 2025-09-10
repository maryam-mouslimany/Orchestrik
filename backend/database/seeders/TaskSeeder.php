<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;

class TaskSeeder extends Seeder
{
    // Tweak these to control volume
    private int $MIN_TASKS_PER_PROJECT = 15;
    private int $MAX_TASKS_PER_PROJECT = 30;

    // Final status distribution
    private array $FINAL_STATUS_WEIGHTS = [
        'pending'      => 15,
        'in progress'  => 40,
        'completed'    => 40,
        'reopened'     => 5,
    ];

    // Priority distribution
    private array $PRIORITY_WEIGHTS = [
        'low'    => 20,
        'medium' => 55,
        'high'   => 25,
    ];

    // PM candidates (the PM for a project must be one of these and be a member of that project)
    private array $PM_IDS = [2, 3, 4];

    public function run(): void
    {
        // Uncomment if you want a clean reset on fresh runs
        // DB::table('task_status_logs')->truncate();
        // DB::table('tasks')->truncate();

        $membersByProject = $this->loadProjectMembers();           // project_id => [user_id...]
        $projects = Project::select('id', 'created_at')->get();

        foreach ($projects as $project) {
            $members = $membersByProject[$project->id] ?? [];
            if (!$members) {
                continue; // skip projects with no members
            }

            // Find the PM for this project: intersection of members with [2,3,4]
            $pmForThisProject = current(array_intersect($this->PM_IDS, $members));
            if (!$pmForThisProject) {
                // Safety: if somehow no PM is present, inject one (pick 2/3/4) and add it to members
                $pmForThisProject = $this->pick($this->PM_IDS);
                $members[] = $pmForThisProject;
                $membersByProject[$project->id] = array_values(array_unique($members));
                DB::table('project_members')->insert([
                    'project_id' => $project->id,
                    'user_id'    => $pmForThisProject,
                ]);
            }

            $count = random_int($this->MIN_TASKS_PER_PROJECT, $this->MAX_TASKS_PER_PROJECT);
            $logBuffer = [];

            for ($i = 0; $i < $count; $i++) {
                $createdBy = $pmForThisProject;                     // RULE: created_by must be the project's PM
                $assigneePool = array_values(array_diff($members, [$createdBy])); // prefer non-PM assignees
                if (empty($assigneePool)) $assigneePool = $members; // fallback: allow PM if team empty
                $assignedTo = $this->pick($assigneePool);

                $priority   = $this->pickWeighted($this->PRIORITY_WEIGHTS);
                $createdAt  = $this->randomCreatedAt($project->created_at);
                $deadline   = (clone $createdAt)->addDays(random_int(2, 45));
                $final      = $this->pickWeighted($this->FINAL_STATUS_WEIGHTS);

                $title = $this->fakeTitle();
                $desc  = $this->fakeDescription();

                $taskId = DB::table('tasks')->insertGetId([
                    'title'       => $title,
                    'description' => $desc,
                    'created_by'  => $createdBy,
                    'priority'    => $priority,
                    'deadline'    => $deadline,
                    'status'      => $final,
                    'project_id'  => $project->id,
                    'assigned_to' => $assignedTo,
                    'created_at'  => $createdAt,
                    'updated_at'  => $createdAt,
                ]);

                // Build a long-ish, coherent status history per your rules
                [$logs, $lastTs] = $this->buildStatusLogs(
                    taskId:       $taskId,
                    finalStatus:  $final,
                    createdAt:    $createdAt,
                    deadline:     $deadline,
                    pmUserId:     $pmForThisProject,
                    members:      $members,
                    assigneeId:   $assignedTo
                );

                $logBuffer = array_merge($logBuffer, $logs);

                DB::table('tasks')->where('id', $taskId)->update(['updated_at' => $lastTs]);
            }

            foreach (array_chunk($logBuffer, 1000) as $chunk) {
                DB::table('task_status_logs')->insert($chunk);
            }
        }
    }

    // ---------------- helpers ----------------

    private function loadProjectMembers(): array
    {
        $rows = DB::table('project_members')->select('project_id', 'user_id')->get();
        $map = [];
        foreach ($rows as $r) {
            $map[$r->project_id] ??= [];
            $map[$r->project_id][] = $r->user_id;
        }
        return $map;
    }

    private function pick(array $arr) { return $arr[array_rand($arr)]; }

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
        return $base->copy()->addDays(random_int(0, 120))->setTime(random_int(9,18), random_int(0,59));
    }

    private function fakeTitle(): string
    {
        $verbs = ['Draft','Design','Shoot','Edit','Review','Optimize','Publish','QA','Brief','Storyboard'];
        $items = ['Reel','Static Post','Carousel','Landing Page','Ad Set','Campaign','Storyboard','Logo Variations','Billboard Mock'];
        $topic = ['Autumn','Holiday','New Product','Awareness','Engagement','Retargeting','UGC','Event Teaser'];
        return "{$this->pick($verbs)} {$this->pick($items)} – {$this->pick($topic)}";
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

    /**
     * NOTE rules enforced here:
     * - note REQUIRED if to_status = 'completed' or 'reopened'
     * - 'reopened' transition is ALWAYS performed by the project PM
     * - changed_by for other transitions is a project member (often the assignee)
     * - Generates multiple logs to make histories long where possible
     */
    private function buildStatusLogs(
        int $taskId,
        string $finalStatus,
        Carbon $createdAt,
        Carbon $deadline,
        int $pmUserId,
        array $members,
        int $assigneeId
    ): array
    {
        $t = (clone $createdAt);
        $logs = [];

        // Build a path consistent with the final status, with extra hops for realism
        switch ($finalStatus) {
            case 'completed':
                // pending -> in progress -> (optional extra in-progress hops) -> completed
                $logs[] = $this->log($taskId, 'pending', 'in progress', $this->pick([$assigneeId, $pmUserId]), $t = $this->tick($t));

                // 0–3 extra “still in progress” hops (no notes)
                $extra = random_int(0, 3);
                for ($i=0; $i<$extra; $i++) {
                    $by = (random_int(1, 100) <= 70) ? $assigneeId : $this->pick($members);
                    $logs[] = $this->log($taskId, 'in progress', 'in progress', $by, $t = $this->tick($t));
                }

                // Complete (with note)
                // 30% chance completion happens AFTER deadline to create overdue completions
                if (random_int(1,100) <= 30) {
                    $t = (clone $deadline)->addDays(random_int(1,7))->setTime(random_int(9,18), random_int(0,59));
                } else {
                    $t = $this->tick($t);
                }
                $logs[] = $this->log($taskId, 'in progress', 'completed', $assigneeId, $t, $this->completionNote());
                break;

            case 'in progress':
                // pending -> in progress (+ extras), stays in progress (no note at the end)
                $logs[] = $this->log($taskId, 'pending', 'in progress', $assigneeId, $t = $this->tick($t));
                $extra = random_int(1, 4);
                for ($i=0; $i<$extra; $i++) {
                    $by = (random_int(1, 100) <= 70) ? $assigneeId : $this->pick($members);
                    $logs[] = $this->log($taskId, 'in progress', 'in progress', $by, $t = $this->tick($t));
                }
                break;

            case 'pending':
                // stays pending (no transitions or just a PM acknowledgment hop)
                if (random_int(1,100) <= 30) {
                    $logs[] = $this->log($taskId, 'pending', 'pending', $pmUserId, $t = $this->tick($t));
                }
                break;

            case 'reopened':
                // pending -> in progress -> reopened (by PM with note)
                $logs[] = $this->log($taskId, 'pending', 'in progress', $assigneeId, $t = $this->tick($t));
                $logs[] = $this->log($taskId, 'in progress', 'reopened', $pmUserId, $t = $this->tick($t), $this->reopenReason());

                // Optional more work after reopen
                if (random_int(1,100) <= 60) {
                    $logs[] = $this->log($taskId, 'reopened', 'in progress', $assigneeId, $t = $this->tick($t));
                    // maybe another reopen cycle
                    if (random_int(1,100) <= 25) {
                        $logs[] = $this->log($taskId, 'in progress', 'reopened', $pmUserId, $t = $this->tick($t), $this->reopenReason());
                    }
                }
                break;
        }

        $lastTs = empty($logs) ? $createdAt : end($logs)['created_at'];
        return [$logs, $lastTs];
    }

    private function tick(Carbon $t): Carbon
    {
        // Advance 1–7 days, set to working-hours time
        return $t->copy()->addDays(random_int(1,7))->setTime(random_int(9,18), random_int(0,59));
    }

    private function log(int $taskId, string $from, string $to, int $by, Carbon $ts, ?string $note = null): array
    {
        // Enforce: notes only when to_status is completed or reopened
        if (!in_array($to, ['completed','reopened'], true)) {
            $note = null;
        }

        return [
            'task_id'     => $taskId,
            'from_status' => $from,
            'to_status'   => $to,
            'changed_by'  => $by,
            'note'        => $note,
            'created_at'  => $ts,
            'updated_at'  => $ts,
        ];
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
            'Specs mismatch for OOH; revise dimensions.',
        ];
        return 'PM Reopen: ' . $reasons[array_rand($reasons)];
    }
}
