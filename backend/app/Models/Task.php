<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'project_id',
        'created_by',
        'assigned_to',
        'parent_task_id',
        'deadline',
        'duration'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function parentTask()
    {
        return $this->belongsTo(Task::class, 'parent_task_id');
    }

    public function childTasks()
    {
        return $this->hasMany(Task::class, 'parent_task_id');
    }

    public function statusLogs()
    {
        return $this->hasMany(TaskStatusLog::class);
    }
    public function latestStatusLog()
    {
        return $this->hasOne(\App\Models\TaskStatusLog::class)->latestOfMany('created_at');
    }

    public function latestCompletedLog()
    {
        return $this->hasOne(\App\Models\TaskStatusLog::class)
            ->where('to_status', 'completed')
            ->latestOfMany('created_at');
    }


}
