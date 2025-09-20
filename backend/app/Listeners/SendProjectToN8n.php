<?php

namespace App\Listeners;

use Illuminate\Support\Str;
use App\Events\ProjectCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Http;

class SendProjectToN8n implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(ProjectCreated $event): void
    {
        $project = $event->project->loadMissing(['members.role', 'creator', 'client']);

        // NEW: channel name = "client-{clientId}-{project-name-slug}"
        $clientId = $project->client?->id ?? $project->client_id ?? 'unknown';
        $channelBase = "client {$clientId} {$project->name}";
        $channelName = Str::slug($channelBase, '-');
        $channelName = substr($channelName, 0, 79); 

        $memberEmails = $project->members
            ->pluck('email')
            ->filter()
            ->unique()
            ->values()
            ->all();

        $pm = $project->members->first(function ($user) {
            return strtolower((string)($user->role->name ?? '')) === 'pm';
        });

        $welcome = $event->input['welcomeMessage'] ?? "Welcome to {$project->name}! 🎉";
        $description = trim((string)($project->description ?? ''));
        $pmLine = $pm
            ? "Project Manager: {$pm->name} ({$pm->email})"
            : "Project Manager: TBD";

        $message = implode("\n\n", array_filter([$welcome, $description, $pmLine]));

        $payload = [
            'channelName' => $channelName,  
            'members'     => $memberEmails,
            'message'     => $message,
        ];

        Http::timeout(15)
            ->acceptJson()
            ->post(config('services.n8n.project_webhook'), $payload)
            ->throw();
    }
}
