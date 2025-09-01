<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|max:255|unique:users,email',
            'password'    => 'required|string|min:6',
            'role_id'     => 'required|integer|exists:roles,id',
            'position_id' => 'required|integer|exists:positions,id',
            'skills'      => 'required|array|min:1',
            'skills.*'    => 'integer|exists:skills,id',
        ];
    }
}
