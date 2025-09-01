<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\models\Position;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PositionSeeder extends Seeder
{
   
    public function run(): void
    {
         $positions = [
            'Photographer',
            'Project Manager',
            'Videographer',
            'Video Editor',
            'Graphic Designer',
            'Content Strategist',
        ];

        foreach ($positions as $position) {
            Position::create(['name' => $position]);
        }

    }
}
