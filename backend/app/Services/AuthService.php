<?php

namespace App\services;

use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    static function login($request)
    {        
        $token = Auth::attempt($request);
        if (!$token) {
            return null;
        }

        $user = Auth::user();
        $user->token = $token;
        return $user;
    }
}
