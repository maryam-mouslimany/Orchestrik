<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AuthService;
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

    public function validateToken(Request $request)
    {
        try {
            $user = AuthService::validateToken($request);  

            if (!$user) {
                return $this->error('Invalid token', 401);
            }

            return $this->success($user, 'Valid token.');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
