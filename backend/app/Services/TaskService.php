<?php

namespace App\Services;
use App\Events\UnreadCountUpdated;

use App\Models\Task;
use App\Models\User;
use App\Models\TaskStatusLog;
use Illuminate\Support\Facades\Auth;

use App\Notifications\TaskCreatedNotification;

class TaskService
{
    public static function createTask(array $data): Task
    {
        $creator = Auth::user();
        $data['created_by'] = $creator->id;
        
        if (empty($data['status'])) {
        $data['status'] = 'pending';
    }
        $task = Task::create($data);

        $employee = User::findOrFail($data['assigned_to']);
        $employee->notify(new TaskCreatedNotification($task));
        $count = $employee->unreadNotifications()->count();
        event(new UnreadCountUpdated($employee->id, $count));

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
