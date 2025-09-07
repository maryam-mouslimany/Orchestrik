<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\models\Skill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            // Content
            'Content Writing',
            'Content Planning',

            // Design & Visual
            'Graphic Design',
            'Branding',
            'Photo Editing',

            // Photo/Video
            'Photography',
            'Cinematography',
            'Video Production',
            'Video Editing',
            'Color Grading',

            // Social / Growth
            'Social Media Management',
            'Community Management',
            'Influencer Outreach',
            'Media Buying',
            'Campaign Management',

            // SEO/SEM & Analytics
            'SEO',
            'Keyword Research',
            'On-page SEO',
            'SEM / PPC (Google Ads, Meta)',
            'Marketing Analytics (GA4)',
        ];
        foreach ($skills as $skill) {
            Skill::firstOrCreate(['name' => $skill]);
        }
    }
}
