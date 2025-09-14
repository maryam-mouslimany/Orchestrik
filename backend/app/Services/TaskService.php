<?php

namespace App\services;

use App\Models\Task;
use App\Models\User;
use App\Models\TaskStatusLog;

use App\Notifications\TaskCreatedNotification;

class TaskService
{
    static function createTask($data, $parentTask)
    {
        try {
            if ($parentTask) {
                $data['parent_task_id'] = $parentTask;
            }
            $creator = auth()->user();
            $data['created_by'] = $creator->id;
            $task = Task::create($data);

            if ($creator->role->name === 'admin') {
                // notify project manager
                $pm = User::whereHas('role', fn($q) => $q->where('name', 'pm'))->first();
                $pm->notify(new TaskCreatedNotification($task, $creator->role->name));
            } elseif ($creator->role->name === 'pm') {
                // notify employee
                $employee = User::whereHas('role', fn($q) => $q->where('name', 'employee'))->first();
                $employee->notify(new TaskCreatedNotification($task, $creator->role->name));
            }
        } catch (\Exception $e) {
            dd($e->getMessage());
        }
        return $task;
    }

    static function editStatus($data, $taskId)
    {
        try {
            $task = Task::findOrFail($taskId);
            $oldStatus = $task->status;

            $updateData = ['status' => $data['status']];
            if (isset($data['duration'])) {
                $updateData['duration'] = $data['duration'];
            }

            $task->update($updateData);

            TaskStatusLog::create([
                'task_id'    => $task->id,
                'from_status' => $oldStatus,
                'to_status'  => $data['status'],
                'changed_by' =>  auth()->user()->id,
                'note'       => $data['note'] ?? null,
            ]);
        } catch (\Exception $e) {
            dd($e->getMessage());
        }
        return $task;
    }

    static function employeeTasks($request)
    {
        $filters      = $request['filters'] ?? $request;

        $projectId    = $filters['projectId']   ?? null;
        $status       = $filters['status']      ?? null;          
        $priority     = $filters['priority']    ?? null;        
        $assignedTo   = $filters['assigned_to'] ?? null;

        // detect pagination (top-level OR inside filters)
        $page         = request('page',        $filters['page']     ?? null);
        $perPageInput = request('per_page',    $filters['per_page'] ?? null);
        $perPage      = $perPageInput !== null ? max(1, min((int)$perPageInput, 100)) : null;

        $user = auth()->user();
        $role = strtolower((string)($user->role->name ?? ''));

        $q = Task::query()->with(['project', 'assignee']);

        if ($role === 'employee') {
            $q->where('assigned_to', $user->id);
        } elseif ($role === 'pm') {
            $q->where('created_by', $user->id);
        }

        if ($projectId) $q->where('project_id', (int)$projectId);

        if (!empty($assignedTo)) {
            is_array($assignedTo)
                ? $q->whereIn('assigned_to', $assignedTo)
                : $q->where('assigned_to', (int)$assignedTo);
        }

        if (!empty($status)) {
            is_array($status) ? $q->whereIn('status', $status) : $q->where('status', $status);
        }

        if (!empty($priority)) {
            is_array($priority) ? $q->whereIn('priority', $priority) : $q->where('priority', $priority);
        }

        $q->orderByDesc('updated_at');

        if ($perPage !== null) {
            return $page !== null
                ? $q->paginate($perPage, ['*'], 'page', (int)$page)
                : $q->paginate($perPage);
        }

        return $q->get();
    }

    static function taskDetails($request)
    {
        return Task::find($request['taskId']);
    }
}
