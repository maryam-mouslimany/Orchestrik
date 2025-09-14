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
        $filters   = $request['filters'] ?? $request;

        $projectId = $filters['projectId'] ?? null;
        $status = $filters['status'] ?? null;
        $deadline = $filters['deadline'] ?? [];
        $priority = $filters['priority'] ?? [];
        $assigned_to = $filters['assigned_to'] ?? [];

        $user = auth()->user();
        $role = ($user->role->name ?? '');

        $q = Task::query()->with(['project', 'assignee']);

        if ($role === 'employee') {
            $q->where('assigned_to', $user->id);
        } elseif ($role === 'pm') {
            $q->where('created_by', $user->id);
        }

        if (!empty($filters['projectId'])) {
            $q->where('project_id', $projectId);
        }

        if (!empty($filters['assigned_to'])) {
            $q->where('assigned_to', $assigned_to);
        }

        if (!empty($filters['status'])) {
            $q->where('status', $status);
        }
        if (!empty($filters['priority'])) {
            $q->where('priority', $priority);
        }

        return $q->get();
    }

    static function taskDetails($request)
    {
        return Task::find($request['taskId']);
    }
}
