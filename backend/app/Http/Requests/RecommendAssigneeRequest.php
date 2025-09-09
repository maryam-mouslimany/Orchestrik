<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RecommendAssigneeRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
         return [
            'project_id'  => 'required|integer|exists:projects,id',
            'title'       => 'required|string|min:2',
            'description' => 'required|string',
        ];
    }
}
