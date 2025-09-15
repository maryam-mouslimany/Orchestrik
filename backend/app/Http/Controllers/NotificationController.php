<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\NotificationService;

class NotificationController extends Controller
{
    function getNotifications()
    {
        try {
            $notifications = NotificationService::getNotifications();
            if (!$notifications)
                return $this->error('Notifications Not Found.');
            return $this->success($notifications);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    function markAsRead(Request $request)
    {
        try {
            $notification = NotificationService::markAsRead($request);
            if (!$notification)
                return $this->error('Notifications Not Maked as read.');
            return $this->success($notification);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
    
    function count()
    {
        try {
            $count = auth()->user()->unreadNotifications()->count();
            if (!$count)
                return $this->error('Count NotFound.');
            return $this->success($count);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
