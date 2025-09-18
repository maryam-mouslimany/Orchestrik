<?php

namespace App\Services;

use App\Models\TaskStatusLog;
use App\Models\User;
use App\Models\Skill;
use App\Models\Position;
use App\Models\Task;

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
            ->where('role_id', '3')
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

    public static function positionsDistribution()
    {
        $totalUsers = User::count();

        $positions = Position::query()
            ->withCount('users')
            ->orderByDesc('users_count')
            ->get(['id', 'name']);

        return $positions->map(function (Position $s) use ($totalUsers) {
            $count = (int) $s->users_count;
            $pct   = $totalUsers > 0 ? round(($count / $totalUsers) * 100, 2) : 0.0;

            return [
                'id'         => (int) $s->id,
                'name'       => (string) $s->name,
                'count'      => $count,
                'percentage' => $pct,
            ];
        })->all();
    }


    public static function skillsDistribution()
    {
        $totalUsers = User::count();

        $skills = Skill::query()
            ->withCount('users')
            ->orderByDesc('users_count')
            ->get(['id', 'name']);

        return $skills->map(function (Skill $s) use ($totalUsers) {
            $count = (int) $s->users_count;
            $pct   = $totalUsers > 0 ? round(($count / $totalUsers) * 100, 2) : 0.0;

            return [
                'id'         => (int) $s->id,
                'name'       => (string) $s->name,
                'count'      => $count,
                'percentage' => $pct,
            ];
        })->all();
    }

    static function ActualVsEstimated(): array
    {
        $tasks = Task::query()
            ->whereHas('latestStatusLog', fn($q) => $q->where('to_status', 'completed'))
            ->with([
                'latestCompletedLog' => fn($q) => $q->select(
                    'task_status_logs.id',        
                    'task_status_logs.task_id',   
                    'task_status_logs.duration',
                    'task_status_logs.created_at'
                ),
                'assignee:id,name',
            ])
            ->select(['id', 'title', 'assigned_to', 'estimated_duration'])
            ->get();
        return $tasks->map(function ($t) {
            return [
                'title'     => (string) $t->title,
                'estimated' => (float) ($t->estimated_duration ?? 0),
                'actual'    => (float) optional($t->latestCompletedLog)->duration ?? 0,
                'assignee'  => (string) optional($t->assignee)->name ?? '—',
            ];
        })->values()->toArray();
    }
}
