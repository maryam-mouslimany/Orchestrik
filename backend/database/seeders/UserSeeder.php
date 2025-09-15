<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Skill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Jawad Ashkar',
                'email' => 'jawad@company.com',
                'position_id' => 13, // Creative Director
                'role_id' => 1,
            ],

            // --- PMs (role_id = 2) - position_id = 1
            [
                'name' => 'Maryam mouslimany',
                'email' => 'mouslimanymaryam@gmail.com',
                'position_id' => 1, // Project Manager
                'role_id' => 2,
            ],
            [
                'name' => 'Rania Saad',
                'email' => 'rania@company.com',
                'position_id' => 1, // Project Manager
                'role_id' => 2,
            ],
            [
                'name' => 'Nabil Farroukh',
                'email' => 'nabil@company.com',
                'position_id' => 1, // Project Manager
                'role_id' => 2,
            ],

            // --- Employees (role_id = 3) — cover ALL positions once (at least)
            [
                'name' => 'Sara Nassar',
                'email' => '92210054@students.liu.edu.lb',
                'position_id' => 2, // Content Strategist
                'role_id' => 3,
            ],
            [
                'name' => 'Karim Mansour',
                'email' => 'karim@company.com',
                'position_id' => 3, // Content Writer
                'role_id' => 3,
            ],
            [
                'name' => 'Dina Itani',
                'email' => 'dina@company.com',
                'position_id' => 4, // Graphic Designer
                'role_id' => 3,
            ],
            [
                'name' => 'Hadi Rahme',
                'email' => 'hadi@company.com',
                'position_id' => 5, // Photographer
                'role_id' => 3,
            ],
            [
                'name' => 'Ziad Shami',
                'email' => 'ziad@company.com',
                'position_id' => 6, // Videographer
                'role_id' => 3,
            ],
            [
                'name' => 'Noor Hamdan',
                'email' => 'noor@company.com',
                'position_id' => 7, // Video Editor
                'role_id' => 3,
            ],
            [
                'name' => 'Lina Fares',
                'email' => 'lina@company.com',
                'position_id' => 8, // Community Manager
                'role_id' => 3,
            ],
            [
                'name' => 'Ahmad Barakat',
                'email' => 'ahmad@company.com',
                'position_id' => 9, // SEO Specialist
                'role_id' => 3,
            ],
            [
                'name' => 'Tarek Ghannam',
                'email' => 'tarek@company.com',
                'position_id' => 10, // SEM / PPC Specialist
                'role_id' => 3,
            ],
            [
                'name' => 'Joumana Rizk',
                'email' => 'joumana@company.com',
                'position_id' => 11, // Media Buyer
                'role_id' => 3,
            ],
            [
                'name' => 'Fadi Choueiri',
                'email' => 'fadi@company.com',
                'position_id' => 12, // Marketing Analyst
                'role_id' => 3,
            ],
            [
                'name' => 'Youssef Karam',
                'email' => 'youssef@company.com',
                'position_id' => 14, // Art Director
                'role_id' => 3,
            ],
            [
                'name' => 'Rana Srour',
                'email' => 'rana@company.com',
                'position_id' => 15, // Production Assistant
                'role_id' => 3,
            ],


        ];

        foreach ($users as $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make('123456'),
                'position_id' => $userData['position_id'],
                'role_id' => $userData['role_id'],
            ]);

            $skillMap = [
                'mouslimanymaryam@gmail.com'   => ['Graphic Design', 'Branding', 'Content Planning'],

                '92210054@students.liu.edu.lb'    => ['Campaign Management', 'Content Planning', 'Marketing Analytics (GA4)'],
                'rania@company.com'   => ['Campaign Management', 'Content Planning', 'SEO'],
                'nabil@company.com'   => ['Campaign Management', 'Content Planning', 'Media Buying'],

                'sara@company.com'    => ['Content Planning', 'Content Writing', 'Campaign Management'],
                'karim@company.com'   => ['Content Writing', 'SEO', 'Keyword Research'],
                'dina@company.com'    => ['Graphic Design', 'Branding', 'Photo Editing'],
                'hadi@company.com'    => ['Photography', 'Photo Editing', 'Cinematography'],
                'ziad@company.com'    => ['Cinematography', 'Video Production', 'Color Grading'],
                'noor@company.com'    => ['Video Editing', 'Color Grading', 'Video Production'],
                'lina@company.com'    => ['Community Management', 'Social Media Management', 'Influencer Outreach'],
                'ahmad@company.com'   => ['SEO', 'On-page SEO', 'Keyword Research'],
                'tarek@company.com'   => ['SEM / PPC (Google Ads, Meta)', 'Campaign Management', 'Marketing Analytics (GA4)'],
                'joumana@company.com' => ['Media Buying', 'Campaign Management', 'Social Media Management'],
                'fadi@company.com'    => ['Marketing Analytics (GA4)', 'A/B Testing', 'SEO'],
                'youssef@company.com' => ['Branding', 'Graphic Design', 'Content Planning'],
                'rana@company.com'    => ['Video Production', 'Photo Editing'], 
            ];

            foreach ($skillMap as $email => $skillNames) {
                $user = User::where('email', $email)->first();
                if (!$user) continue;

                $skillIds = Skill::whereIn('name', $skillNames)->pluck('id')->all();
                // attach via the BELONGSTOMANY relation -> employee_skills
                $user->skills()->syncWithoutDetaching($skillIds);
            }
        }
    }
}
