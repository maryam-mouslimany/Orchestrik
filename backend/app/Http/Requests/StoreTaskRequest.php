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
            'deadline' => 'nullable|date',
            'project_id' => 'required|exists:projects,id',
            'parent_task_id' => 'nullable|exists:tasks,id',
            'assigned_to' => [
                'sometimes',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    $project = Project::with('members')->find($this->input('project_id'));

                    if (!$project) {
                        $fail('The selected project does not exist.');
                        return;
                    }

                    if (! $project->members->pluck('id')->contains($value)) {
                        $fail('The selected user is not a member of this project.');
                    }
                }
            ],
        ];
    }
}
