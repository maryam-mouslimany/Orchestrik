<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreTaskRequest;
use App\services\TaskService;
use App\Models\Task;
use App\Http\Requests\UpdateTaskStatusRequest;
use App\Http\Requests\GetTaskRequest;

class TaskController extends Controller
{
    function createTask(StoreTaskRequest $request)
    {
        try {
            $task = TaskService::createTask($request->validated());
            if (!$task)
                return $this->error('Task Not Created');
            return $this->success($task);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    function editStatus(UpdateTaskStatusRequest $request, $taskId)
    {
        try {
            $task = TaskService::editStatus($request->validated(), $taskId);
            if (!$task)
                return $this->error('Status not updated successfully');
            return $this->success($task);
        } catch (\Exception $e) {
            return $this->error('Something went wrong', 500);
        }
    }

    function employeeTasks(GetTaskRequest $request)
    {
        try {
            $tasks = TaskService::employeeTasks($request->validated());
            if (!$tasks)
                return $this->error('Tasks Not found');
            return $this->success($tasks);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    function taskDetails(Request $request)
    {
        try {
            $task = TaskService::taskDetails($request);
            if (!$task)
                return $this->error('Task Not found');
            return $this->success($task);
        } catch (\Exception $e) {
            return $this->error('Something went wrong', 500);
        }
    }
}
