<?php

namespace App\Services;

use App\Models\Project;
use Carbon\Carbon;

class ProjectAnalyticsService
{
    static function taskStatusBreakdown($request): ?array
    {
        $validated = $request->validate(['project_id' => ['required', 'integer', 'exists:projects,id'],]);

        $project = Project::with(['tasks:id,project_id,status'])
            ->find($validated['project_id']);

        $tasks = $project->tasks;
        $total = $tasks->count();

        $byStatus = $tasks
            ->groupBy('status')
            ->map(function ($group, $status) use ($total) {
                $count = $group->count();
                return [
                    'status'  => (string) $status,
                    'count'   => $count,
                    'percent' => $total > 0 ? round(($count / $total) * 100, 2) : 0.0,
                ];
            })
            ->values()
            ->all();

        return [
            'project_id' => $project->id,
            'total'      => $total,
            'by_status'  => $byStatus,
        ];
    }
    public static function completedOnTimeVsOverdue($request): array
    {
        $v = $request->validate([
            'project_id' => ['required', 'integer', 'exists:projects,id'],
        ]);

        $project = Project::with([
            'tasks' => fn($q) =>
            $q->where('status', 'completed')
                ->select('id', 'project_id', 'deadline'),
            'tasks.statusLogs' => fn($q) =>
            $q->where('to_status', 'completed')
                ->latest('created_at')->limit(1),
        ])->find($v['project_id']);

        $completed = $project->tasks;
        $total = $completed->count();

        $overdue = $completed->filter(function ($t) {
            $log = $t->statusLogs->first();               
            if (!$log) return false;                     
            $deadlineEnd = ($t->deadline instanceof \Carbon\Carbon
                ? $t->deadline
                : \Carbon\Carbon::parse($t->deadline))->endOfDay();

            return $log->created_at->gt($deadlineEnd);  
        })->count();

        $onTime = $total - $overdue;

        return [
            'project_id'       => (int) $project->id,
            'completed_total'  => $total,
            'on_time_count'    => $onTime,
            'overdue_count'    => $overdue,
            'on_time_percent'  => $total ? round(($onTime  / $total) * 100, 2) : 0.0,
            'overdue_percent'  => $total ? round(($overdue / $total) * 100, 2) : 0.0,
        ];
    }
}
