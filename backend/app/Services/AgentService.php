<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Services\Agent\LLM\LLMClient;

class AgentService
{
    public static function reopenedTasks(?int $projectId = null, int $limit = 20): array
        {
            // 1) Query DB for reopened tasks (CHANGE names if needed)
            $query = DB::table('tasks')
                ->when($projectId, fn($q) => $q->where('project_id', $projectId))
                ->where('status', 'reopened')
                ->orderByDesc('updated_at')
                ->limit($limit);

            // Select columns that actually exist in your schema
            $rows = $query->get([
                'id',
                'title',
                'status',
                'priority',     // remove if not present
                'assigned_to',  // remove if not present
                'updated_at',
            ]);

            // 2) Compact context for the LLM
            $tasks = $rows->map(function ($r) {
                return [
                    'id'         => $r->id,
                    'title'      => Str::limit((string)($r->title ?? ''), 120),
                    'status'     => $r->status ?? null,
                    'priority'   => $r->priority ?? null,
                    'assigneeId' => $r->assignee_id ?? null,
                    'updatedAt'  => (string)($r->updated_at ?? ''),
                ];
            })->values()->all();

            // 3) Inline prompt (no separate prompt file yet)
            $prompt = "You are a project assistant. Analyze the following reopened tasks and return:\n" .
                "- A brief prioritized summary (max 6 lines)\n" .
                "- The top 3 concrete next actions\n\n" .
                "Tasks JSON:\n" . json_encode($tasks, JSON_UNESCAPED_SLASHES);

            // 4) Resolve Gemini client from the container (no DI, static style)
            /** @var LLMClient $llm */
            $llm = app(LLMClient::class);

            $analysis = $llm->chat([
                ['role' => 'user', 'content' => $prompt],
            ], [
                // For later: enforce JSON
                // 'generationConfig' => ['responseMimeType' => 'application/json']
            ]);

            // 5) Return payload (controller will wrap with your trait)
            return [
                'project_id' => $projectId,
                'count'      => count($tasks),
                'tasks'      => $tasks,
                'analysis'   => $analysis,
            ];
        }
}
