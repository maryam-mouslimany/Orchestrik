<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{

    public function run(): void
    {
        $roles = [
            ['name' => 'admin', 'color' => '#99ABC7'],
            ['name' => 'pm', 'color' => '#EB6D6F'],
            ['name' => 'employee', 'color' => '#FFC65B'],

        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
