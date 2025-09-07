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
            'Project Manager',
            'Content Strategist',
            'Content Writer',
            'Graphic Designer',
            'Photographer',
            'Videographer',
            'Video Editor',
            'Community Manager',
            'SEO Specialist',
            'SEM / PPC Specialist',
            'Media Buyer',
            'Marketing Analyst',
            'Creative Director',
            'Art Director',
            'Production Assistant',
        ];
        foreach ($positions as $position) {
            Position::firstOrCreate(['name' => $position]);
        }
    }
}
