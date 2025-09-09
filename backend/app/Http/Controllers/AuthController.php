<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\services\AuthService;
use App\Http\Requests\LoginRequest;

class AuthController extends Controller
{
    function login(LoginRequest $request)
    {
        try {
            $user = AuthService::login($request->validated());

            if (!$user) {
                return $this->error('Invalid credentials', 401);
            }

            $user->load(['role', 'position', 'skills', 'projects']);
            return $this->success($user, 'Successfully Logged In.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
