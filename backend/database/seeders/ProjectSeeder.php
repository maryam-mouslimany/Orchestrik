<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
         $projects = [
            [
                'name' => 'Social Media Strategy for Client 1',
                'description' => 'Developing a full social media strategy with content planning and branding.',
                'created_by' => 1,
                'client_id' => 1,
                'status' => 'active',
            ],
            [
                'name' => 'SEO Optimization for Client 2',
                'description' => 'Improving search engine ranking through keyword research and on-page SEO.',
                'created_by' => 1,
                'client_id' => 2,
                'status' => 'active',
            ],
            [
                'name' => 'Google Ads Campaign for Client 3',
                'description' => 'Running targeted ads to increase conversions and sales.',
                'created_by' => 1,
                'client_id' => 3,
                'status' => 'active',
            ],
            [
                'name' => 'Email Marketing Automation for Client 4',
                'description' => 'Setting up automated email flows and newsletters.',
                'created_by' => 1,
                'client_id' => 4,
                'status' => 'active',
            ],
            [
                'name' => 'Content Creation for Client 5',
                'description' => 'Producing blog posts, videos, and infographics to boost engagement.',
                'created_by' => 1,
                'client_id' => 5,
                'status' => 'active',
            ],
            [
                'name' => 'Brand Awareness Campaign for Client 6',
                'description' => 'Creating digital campaigns to grow brand visibility and recognition.',
                'created_by' => 1,
                'client_id' => 6,
                'status' => 'active',
            ],
            [
                'name' => 'Facebook Ads Management for Client 7',
                'description' => 'Managing ad sets and tracking performance to maximize ROI.',
                'created_by' => 1,
                'client_id' => 7,
                'status' => 'on_hold', // 1st on hold
            ],
            [
                'name' => 'Influencer Marketing for Client 8',
                'description' => 'Collaborating with influencers to promote products.',
                'created_by' => 1,
                'client_id' => 8,
                'status' => 'active',
            ],
            [
                'name' => 'Website Redesign for Client 9',
                'description' => 'Redesigning and optimizing the website for better user experience.',
                'created_by' => 1,
                'client_id' => 9,
                'status' => 'on_hold', // 2nd on hold
            ],
            [
                'name' => 'Analytics & Reporting for Client 10',
                'description' => 'Setting up KPIs and delivering monthly reports.',
                'created_by' => 1,
                'client_id' => 10,
                'status' => 'active',
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
