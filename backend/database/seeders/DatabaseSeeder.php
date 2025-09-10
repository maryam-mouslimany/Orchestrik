<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

    public function run(): void
    {
        $this->call([
            PositionSeeder::class,
            RoleSeeder::class,
            SkillSeeder::class,
            UserSeeder::class,
            ClientSeeder::class,
            ProjectSeeder::class,
            TaskSeeder::class,

        ]);
    }
}
