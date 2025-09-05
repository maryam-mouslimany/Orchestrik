<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Fatat Mouslimany',
                'email' => '92210054@students.liu.edu.lb',
                'password' => '123456',
                'position_id' => 1, 
                'role_id' => 2 
            ],[
                'name' => 'Fatat Mouslimany',
                'email' => 'mouslimanymaryam@gmail.com',
                'password' => '123456',
                'position_id' => 4, 
                'role_id' => 3 // admin
            ],[
                'name' => 'Jawad Ashkar',
                'email' => 'jawad@company.com',
                'password' => '123456',
                'position_id' => 1, 
                'role_id' => 1 // admin
            ],
            [
                'name' => 'Lina Saad',
                'email' => 'lina@company.com',
                'password' => '123456',
                'position_id' => 2, 
                'role_id' => 2 // PM
            ],
            [
                'name' => 'Rami Khalil',
                'email' => 'rami@company.com',
                'password' => '123456',
                'position_id' => 2, 
                'role_id' => 2 
            ],
            [
                'name' => 'Maya Fares',
                'email' => 'maya@company.com',
                'password' => '123456',
                'position_id' => 3,
                'role_id' => 3 //employee
            ],
            [
                'name' => 'Omar Nader',
                'email' => 'omar@company.com',
                'password' => '123456',
                'position_id' => 4,
                'role_id' => 3
            ],
            [
                'name' => 'Sara Haddad',
                'email' => 'sara@company.com',
                'password' => '123456',
                'position_id' => 5,
                'role_id' => 3
            ],
            [
                'name' => 'Ali Rjeily',
                'email' => 'ali@company.com',
                'password' => '123456',
                'position_id' => 1,
                'role_id' => 3
            ],
            [
                'name' => 'Nour Tawk',
                'email' => 'nour@company.com',
                'password' => '123456',
                'position_id' => 6,
                'role_id' => 3
            ],
            [
                'name' => 'Fadi Karam',
                'email' => 'fadi@company.com',
                'password' => '123456',
                'position_id' => 3,
                'role_id' => 3
            ],
            [
                'name' => 'Rana Abi',
                'email' => 'rana@company.com',
                'password' => '123456',
                'position_id' => 4,
                'role_id' => 3
            ],


        ];

        foreach ($users as $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make($userData['password']),
                'position_id' => $userData['position_id'],
                'role_id' => $userData['role_id'],
            ]);

            $user->skills()->attach([1, 3]); // IDs of skills
        }
    }
}
