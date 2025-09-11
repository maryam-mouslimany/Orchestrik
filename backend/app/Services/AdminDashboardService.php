<?php

namespace App\Services;

use App\Models\TaskStatusLog;
use App\Models\User;

class AdminDashboardService
{
    public static function getTopAndLeastCompletedDurations()
    {
        $most = TaskStatusLog::with('task:id,title')
            ->where('to_status', 'completed')
            ->whereNotNull('duration')
            ->orderByDesc('duration')
            ->limit(5)
            ->get(['id', 'task_id', 'duration'])
            ->map(fn($log) => [
                'title'    => $log->task?->title,
                'duration' => (float) $log->duration,
            ])
            ->all();

        $least = TaskStatusLog::with('task:id,title')
            ->where('to_status', 'completed')
            ->whereNotNull('duration')
            ->orderBy('duration')
            ->limit(5)
            ->get(['id', 'task_id', 'duration'])
            ->map(fn($log) => [
                'title'    => $log->task?->title,
                'duration' => (float) $log->duration,
            ])
            ->all();

        return ['most' => $most, 'least' => $least];
    }

    static function employeesWorkload()
    {

        return User::query()
            ->where('role_id', '3') // ← added
            ->withCount([
                'tasks as pending'     => fn($q) => $q->where('status', 'pending'),
                'tasks as in_progress' => fn($q) => $q->where('status', 'in_progress'),
            ])
            ->get(['id', 'name'])
            ->map(fn($u) => [
                'name'        => (string) $u->name,
                'pending'     => (int) $u->pending,
                'in_progress' => (int) $u->in_progress,
                'total'       => (int) ($u->pending + $u->in_progress),
            ])
            ->sortByDesc('total')->values()->all();
    }
}
