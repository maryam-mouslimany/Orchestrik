<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GetTaskRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'filters' => ['nullable', 'array'],
            'filters.assigned_to' => ['nullable', 'string', 'exists:users,id'],
            'filters.projectId' => ['nullable', 'integer', 'exists:projects,id'],
            'filters.status' => ['nullable', 'string', Rule::in(['pending', 'in progress', 'completed', 'reopened'])],
            'filters.priority' => ['nullable', 'string', Rule::in(['low', 'medium', 'high'])],
        ];
    }
}
