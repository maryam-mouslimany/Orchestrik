<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskStatusRequest extends FormRequest
{

    public function authorize(): bool
    {
        $user = $this->user();
        $task = $this->route('taskId');

        // Employee can only update to allowed statuses
        if ($user->role->name === 'employee') {
            return in_array($this->input('status'), ['in progress', 'completed']);
        }

        // PM can update to any status >including 'reopen'
        if ($user->role->name === 'pm') {
            return in_array($this->input('status'), ['in progress', 'completed', 'reopened']);
        }

        return false;
    }

    public function rules(): array
    {
        $rules = [
            'status' => 'required|string|in:in progress,completed,reopened',
        ];

        // Require a note for completion or reopen
        if (in_array($this->input('status'), ['completed', 'reopened'])) {
            $rules['note'] = 'required|string|min:5';
        }

        // Require duration only if status is completed
        if ($this->input('status') === 'completed') {
            $rules['duration'] = 'required|string|min:1'; 
        }
        return $rules;
    }
}
