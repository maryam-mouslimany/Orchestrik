<?php

namespace App\Listeners;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SendProjectToN8n implements ShouldQueue
{
    public $afterCommit = true;   // wait for DB commit

    public function handle(\App\Events\ProjectCreated $event): void
    {
        $project = $event->project->loadMissing(['members']);
        $emails = $project->members->pluck('email')
            ->filter(fn($e) => is_string($e) && filter_var($e, FILTER_VALIDATE_EMAIL))
            ->values()->all();

        // DO NOT let exceptions bubble to the request
        try {
            Http::timeout(10)->acceptJson()->post(
                config('services.n8n.project_webhook'),
                [
                    'channelName' => Str::slug($project->name, '-'),
                    'members'     => $emails,
                    'message'     => $event->input['welcomeMessage'] ?? "Welcome to {$project->name}! 🎉",
                ]
            );
        } catch (\Throwable $e) {
            Log::warning('ProjectCreatedListener n8n call failed', [
                'project_id' => $project->id,
                'error'      => $e->getMessage(),
            ]);
            // IMPORTANT: return; do NOT rethrow
            return;
        }
    }
}
