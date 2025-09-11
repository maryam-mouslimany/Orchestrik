<?php

namespace App\services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    static function getUsers($filters)
    {
        $roleId = $filters['roleId'] ?? null;
        $positionId = $filters['positionId'] ?? null;
        $skills = $filters['skills'] ?? [];

        $q = User::query()
            ->with(['role', 'position', 'skills']);

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
}
