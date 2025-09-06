<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RoleService;

class RoleController extends Controller
{
    function getRoles()
    {
        try {
            $roles = RoleService::getRoles();
            if (!$roles)
                return $this->error('Roles Not Created');
            return $this->success($roles);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
