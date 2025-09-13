<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'filters'            => ['nullable', 'array'],
            'filters.roleId'     => ['nullable', 'integer', 'exists:roles,id'],
            'filters.positionId' => ['nullable', 'integer', 'exists:positions,id'],
            'filters.skills'     => ['nullable', 'array'],
            'filters.skills.*'   => ['integer', 'exists:skills,id'],
            'filters.nameFilter'     => ['nullable', 'string'],
        ];
    }
}
