<?php

namespace App\services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    static function getUsers()
    {
        return User::with(['role', 'position', 'skills'])->get();
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
