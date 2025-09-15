<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class NotificationService
{
    static function getNotifications()
    {
        $user = Auth::user();
        //dd($user);
        return $user->notifications()
            ->whereNull('read_at')
            ->latest()
            ->get();
    }

    static function markAsRead($request)
    {
        $user = Auth::user();
        $notification = $user->notifications()->where('id', $request['notificationId'])->firstOrFail();
        $notification->markAsRead();
        return $notification;
    }
}
