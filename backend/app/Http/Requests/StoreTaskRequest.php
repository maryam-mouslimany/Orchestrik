<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Project;

class StoreTaskRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'status' => 'sometimes|in:pending, in progress, completed, reopened',
            'deadline' => 'nullable|date',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'required|exists:users,id'
        
        ];
    }
}
