<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_id' => 'required|exists:clients,id',
            'members' => 'required|array|min:2',
            'members.*' => 'integer|exists:users,id',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $members = $this->input('members', []);

            if (!empty($members)) {
                $hasPM = \App\Models\User::whereIn('id', $members)
                    ->whereHas('role', function ($query) {
                        $query->where('name', 'pm');
                    })
                    ->exists();

                if (!$hasPM) {
                    $validator->errors()->add('members', 'A Prpject Manager should be assigned to this project');
                }
            }
        });
    }
}
