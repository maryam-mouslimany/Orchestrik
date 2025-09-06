<?php

namespace App\Services;
use App\Models\Role;

class RoleService
{
     static function getRoles(){
            return Role::all();
        }
}
