<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserService
{
    static function getUsers($filters)
    {
        $roleId = $filters['roleId'] ?? null;
        $positionId = $filters['positionId'] ?? null;
        $skills = $filters['skills'] ?? [];
        $nameFilter = $filters['nameFilter'] ?? [];
        $q = User::query()
            ->withTrashed()->with(['role', 'position', 'skills']);

        if (!empty($filters['nameFilter'])) {
            $q->where('name', 'LIKE', '%' . $nameFilter . '%');
        }
        if (!empty($filters['roleId'])) {
            $q->where('role_id', $roleId);
        }

        if (!empty($filters['positionId'])) {
            $q->where('position_id', $positionId);
        }

        if (!empty($skills)) {
            foreach ($skills as $skillId) {
                $q->whereHas('skills', fn($sq) => $sq->where('skills.id', $skillId));
            }
        }

        return $q->get();
    }

    static function createUser($data)
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'position_id' => $data['position_id'],
            'role_id' => $data['role_id'],
        ]);

        $user->skills()->attach($data['skills']);

        return $user->load(['role', 'position', 'skills']);
    }

    static function delete($request)
    {
        $id = $request->validate(['id' => 'required|integer|exists:users,id']);

        User::where('id', $id)->delete();

        return 'deleted';
    }

    static public function restore($request)
    {
        $id = $request->validate([
            'id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->whereNotNull('deleted_at'),
            ],
        ]);
        User::withTrashed()->whereKey($id)->restore();
        $user = User::find($id);

        return $user;
    }
}
