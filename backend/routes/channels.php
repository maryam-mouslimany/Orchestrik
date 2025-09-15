<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('notifications.{userId}', function ($user, $userId) {
    return $user?->id === (int) $userId; 
});
