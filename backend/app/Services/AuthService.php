<?php

namespace App\services;

use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

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

    public static function validateToken()
    {
            $user = JWTAuth::parseToken()->authenticate();
            return $user ?: null;
       
    }
}
