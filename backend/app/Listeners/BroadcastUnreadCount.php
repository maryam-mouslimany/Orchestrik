<?php

namespace App\Listeners;

use Illuminate\Notifications\Events\NotificationSent;
use App\Events\UnreadCountUpdated;
use Illuminate\Support\Facades\Log;

class BroadcastUnreadCount
{
    public function handle(NotificationSent $event): void
    {
        if ($event->channel !== 'database') {
            return;
        }

        $notifiable = $event->notifiable;   
        if (!method_exists($notifiable, 'unreadNotifications')) {
            return;
        }

        $userId = (int) $notifiable->getKey();
        $count  = (int) $notifiable->unreadNotifications()->count();

        Log::info('[BC] NotificationSent → broadcasting count', [
            'userId' => $userId, 'count' => $count,
        ]);

        event(new UnreadCountUpdated($userId, $count));
    }
}
