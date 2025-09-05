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
        $project = $event->project->loadMissing(['members', 'creator', 'client']);
        $channelName = Str::slug($project->name, '-'); 
        $memberEmails = $project->members
            ->pluck('email')
            ->filter()
            ->unique()
            ->values()
            ->all();
        $payload = [
            'channelName'    => $channelName,
            'members'        => $memberEmails, 
            'messaage' => $event->input['welcomeMessage']
                                ?? "Welcome to {$project->name}! 🎉",
        ];

        Http::timeout(15)
            ->acceptJson()
            ->post(config('services.n8n.project_webhook'), $payload)
            ->throw(); // if it fails, the job will retry per queue settings
    }
}
