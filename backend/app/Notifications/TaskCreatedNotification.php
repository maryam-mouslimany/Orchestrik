<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class TaskCreatedNotification extends Notification
{
    use Queueable;

    protected $task;

    public function __construct($task)
    {
        $this->task = $task;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        $project = $this->task->project; 

        return [
            'kind'       => 'task.created',
            'task_id'    => $this->task->id,
            'title'      => "New task assigned ({$this->task->title}) {$project?->title}", 
            'payload'    => [
                'task_title'    => $this->task->title,
                'project_title' => $project?->title,
                'created_by'    => $this->task->created_by,
            ],
        ];
    }

    public function toBroadcast($notifiable)
    {
        $project = $this->task->project;

        return new BroadcastMessage([
            'kind'       => 'task.created',
            'task_id'    => $this->task->id,
            'title'      => "New task assigned ({$this->task->title}) {$project?->title}",
            'payload'    => [
                'task_title'    => $this->task->title,
                'project_title' => $project?->title,
                'created_by'    => $this->task->created_by,
            ],
        ]);
    }
}
