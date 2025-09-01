<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Client;

class ClientSeeder extends Seeder
{
    function run(): void
    {
        $clients = [
            ['name' => 'Rami Khalil', 'email' => 'rami.khalil@gmail.com', 'phone' => '96170123456'],
            ['name' => 'Lea Nader', 'email' => 'lea.nader@gmail.com', 'phone' => '96170234567'],
            ['name' => 'Fadi Saab', 'email' => 'fadi.saab@gmail.com', 'phone' => '96170345678'],
            ['name' => 'Maya Hachem', 'email' => 'maya.hachem@gmail.com', 'phone' => '96170456789'],
            ['name' => 'Tarek Fares', 'email' => 'tarek.fares@gmail.com', 'phone' => '96170567890'],
            ['name' => 'Nadine Karam', 'email' => 'nadine.karam@gmail.com', 'phone' => '96170678901'],
            ['name' => 'Omar Bitar', 'email' => 'omar.bitar@gmail.com', 'phone' => '96170789012'],
            ['name' => 'Rita Chahine', 'email' => 'rita.chahine@gmail.com', 'phone' => '96170890123'],
            ['name' => 'Hassan Abi', 'email' => 'hassan.abi@gmail.com', 'phone' => '96170901234'],
            ['name' => 'Sana Fakhoury', 'email' => 'sana.fakhoury@gmail.com', 'phone' => '96170112345'],
        ];

        foreach ($clients as $client) {
            Client::create($client);
        }
    }
}
