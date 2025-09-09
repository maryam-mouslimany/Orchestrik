<?php

namespace App\Services\Agent;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Project;
use App\Models\Task;
use App\Services\Agent\LLM\LLMClient;

class AssigneeRecommenderService
{
    /**
     * @param array{project_id:int,title:string,description?:string} $data
     * @return array{user: array{id:int,name:string,email:string}, why:string}
     */
    public static function recommend(array $data): array
    {
        $projectId   = (int) $data['project_id'];
        $title       = (string) $data['title'];
        $description = (string) ($data['description'] ?? '');

        $project = Project::findOrFail($projectId);

        // members() per your ER; also eager-load optional position (if exists) + skills
        $members = $project->members()
            ->with([
                'skills:id,name',
                'position:id,name'  // safe if relation exists; else remove this line
            ])
            ->get(['users.id', 'users.name', 'users.email', 'users.position_id']);

        if ($members->isEmpty()) {
            throw new \RuntimeException('This project has no members.');
        }

        // unfinished workload inside this project (you use assigned_to + status != 'completed')
        $openByUser = Task::select('assigned_to', DB::raw('COUNT(*) as cnt'))
            ->where('project_id', $projectId)
            ->whereNotNull('assigned_to')
            ->where('status', '!=', 'completed')
            ->groupBy('assigned_to')
            ->pluck('cnt', 'assigned_to');   // [userId => openCount]

        // Prepare candidates for LLM (include position to help semantic match)
        $candidates = $members->map(function ($u) use ($openByUser) {
            return [
                'id'        => (int) $u->id,
                'name'      => (string) $u->name,
                'email'     => (string) $u->email,
                'position'  => optional($u->position)->name,                      
                'skills'    => $u->skills->pluck('name')->values()->all(),       
                'openTasks' => (int) ($openByUser[$u->id] ?? 0),
            ];
        })->values()->all();

        $taskText = trim($title . ' ' . $description);

        $prompt = <<<PROMPT
You are an assistant in a Digital Marketing company. Your job is to select exactly ONE best assignee for a task.

INPUTS
- Task (raw): "{$taskText}"
- Candidates (JSON array): 
PROMPT;
        $prompt .= json_encode($candidates, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $prompt .= <<<PROMPT

DECISION RULES (apply in order)
1) Match by skills/role: choose candidates whose skills (and, if provided, position) clearly fit the task (keywords, stack, domain).
2) If more than one candidate matches, pick the one with STRICTLY fewer "openTasks".
3) If still tied, pick the lexicographically smallest "name".
4) You MUST select one of the provided candidates.

OUTPUT FORMAT (STRICT JSON, no extra text):
{
   "winner": { "id": <number> },
   "matchedSkills": ["<skill1>", "<skill2>"],  // subset of the winner's skills relevant to the task (1–3 items)
-  "workloadRelation": "fewer" | "tied" | "higher",
-  "winnerOpenTasks": <number>
+  "workloadRelation": "fewer" | "tied" | "higher" | "single",   // "single" = only one matched candidate
+  "winnerOpenTasks": <number>
 }

+ NOTES
+ - Set "workloadRelation" to:
+   - "single" if the winner is the only matched candidate.
+   - "fewer" if the winner has strictly fewer open tasks than ALL other matched candidates.
+   - "tied" only if at least one other matched candidate has the EXACT SAME number of open tasks.
+   - "higher" otherwise.
+ - Always include "winnerOpenTasks" as the integer count for the winner.
+ - Keep "matchedSkills" short and specific (e.g., ["SEO","Keyword Research"]).
PROMPT;

        $llm = app(LLMClient::class);

        $raw = $llm->chat(
            [['role' => 'user', 'content' => $prompt]],
            [
                'generationConfig' => [
                    'temperature'      => 0,
                    'responseMimeType' => 'application/json',
                ]
            ]
        );

        // Parse & validate LLM response (no fallback)
        $decoded = is_array($raw) ? $raw : json_decode((string) $raw, true);
        if (
            !is_array($decoded) ||
            !isset($decoded['winner']['id'], $decoded['winnerOpenTasks'], $decoded['workloadRelation'])
        ) {
            throw new \RuntimeException('LLM returned an invalid JSON response.');
        }

        $winnerId   = (int) $decoded['winner']['id'];
        $winner     = collect($candidates)->firstWhere('id', $winnerId);
        if (!$winner) {
            throw new \RuntimeException('LLM selected an id that is not a project member.');
        }

        // Build the exact reason sentence you want
        $name       = $winner['name'];
        $skillsList = collect($decoded['matchedSkills'] ?? [])
                        ->filter(fn($s) => is_string($s) && $s !== '')
                        ->take(3)->values()->all();
        $skillsText = $skillsList ? implode(' and ', array_slice($skillsList, 0, 2)) : 'relevant skills';
        $open       = (int) $decoded['winnerOpenTasks'];

        $why = "{$name} is the best assignee since he has {$skillsText} skills and currently has {$open} open task(s).";
        if (($decoded['workloadRelation'] ?? 'tied') === 'tied') {
            $why .= " (workload tied)";
        }

        return [
            'user' => [
                'id'    => $winner['id'],
                'name'  => $winner['name'],
                'email' => $winner['email'],
            ],
            'why'  => Str::limit($why, 160, ''),
        ];
    }
}
