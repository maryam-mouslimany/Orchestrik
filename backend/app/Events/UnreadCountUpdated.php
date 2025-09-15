<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow; // NOW: no queue issues
use Illuminate\Support\Facades\Log;

class UnreadCountUpdated implements ShouldBroadcastNow
{
    public function __construct(public int $userId, public int $unreadCount)
    {
        Log::info('[BC] New UnreadCountUpdated', ['userId' => $userId, 'unread' => $unreadCount]);
    }

    public function broadcastOn()
    {
        $channel = new PrivateChannel('notifications.' . $this->userId);
        Log::info('[BC] broadcastOn', ['channel' => $channel->name]);
        return $channel;
    }

    public function broadcastAs()
    {
        return 'UnreadCountUpdated';
    }

    public function broadcastWith(): array
    {
        $payload = ['unread_count' => $this->unreadCount];
        Log::info('[BC] broadcastWith', $payload);
        return $payload;
    }
}
