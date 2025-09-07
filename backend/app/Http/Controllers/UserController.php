<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreUserRequest;
use App\services\UserService;
use App\http\Requests\GetUserRequest;

class UserController extends Controller
{
    public function getUsers(GetUserRequest $request)
    {
        try {
            $users = UserService::getUsers($request->validated()['filters'] ?? []);
            if (!$users)
                return $this->error('Users Not Found');
            return $this->success($users);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function createUser(StoreUserRequest $request)
    {
        try {
            $user = UserService::createUser($request->validated());
            if (!$user)
                return $this->error('User Not Created');
            return $this->success($user);
        } catch (\Exception $e) {
            return $this->error('Something went wrong', 500);
        }
    }

}
