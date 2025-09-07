<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {


        $createdBy = 1;                 // admin user id
        $status    = 'active';
        $clientIds = range(1, 10);      // client IDs 1..10

        // PM candidates; one of these MUST be member on every project
        $pmIds = [2, 3, 4];

        // Member pool: all users except admin (1)
        $allUserIds = User::pluck('id')->all();
        $memberPool = array_values(array_diff($allUserIds, [1])); // includes PMs

        // Project name templates (we'll pick 3 per client by default)
        $pool = [
            ['title'=>'Content Creation Bundle','desc'=>'Monthly content calendar, copywriting, post design set, and short-form videos.'],
            ['title'=>'Performance Marketing Campaign','desc'=>'Paid social + search campaign with weekly optimizations and A/B testing.'],
            ['title'=>'OOH Billboard Flight','desc'=>'Out-of-home placements with creative adaptation and location mix recommendations.'],
            ['title'=>'SEO Retainer','desc'=>'Technical fixes, on-page SEO, keyword content plan, monthly reporting.'],
            ['title'=>'Influencer Campaign','desc'=>'Creator sourcing, briefing, post scheduling, and performance tracking.'],
            ['title'=>'Brand Refresh','desc'=>'Visual refresh, brand book updates, and social templates.'],
            ['title'=>'Quarterly Social Ads','desc'=>'Always-on Meta/TikTok with creative refresh every 3 weeks.'],
            ['title'=>'Event Coverage','desc'=>'Photo/video coverage, highlights edit, and live social posting.'],
            ['title'=>'YouTube Pre-Roll Set','desc'=>'6s/15s edits, bumper variations, channel targeting plan.'],
            ['title'=>'Product Launch Sprint','desc'=>'Launch assets, teaser videos, landing page, 2-week ad burst.'],
        ];

        $projectsPerClient = 3; // change if you want more/less per client
        $pmIndex = 0;

        foreach ($clientIds as $clientId) {
            $pick = collect($pool)->shuffle()->take($projectsPerClient)->all();

            foreach ($pick as $tpl) {
                // Choose a PM (2, 3, or 4) in round-robin
                $pmUserId = $pmIds[$pmIndex % count($pmIds)];
                $pmIndex++;

                $name = "Client {$clientId} – {$tpl['title']}";

                // Create or get project (NO pm_id column used)
                $project = Project::firstOrCreate(
                    ['client_id' => $clientId, 'name' => $name],
                    [
                        'description' => $tpl['desc'],
                        'created_by'  => $createdBy,
                        'status'      => $status,
                    ]
                );

                // Build members list: must include the PM + 4..8 extra members (no admin)
                $extraCount = random_int(4, 8);
                $extraMembers = collect($memberPool)
                    ->shuffle()
                    ->take($extraCount)
                    ->all();

                $memberIds = array_values(array_unique(array_merge([$pmUserId], $extraMembers)));

                // Avoid duplicates on reseed: wipe existing members for this project, then insert fresh
                DB::table('project_members')->where('project_id', $project->id)->delete();

                $rows = array_map(fn($uid) => [
                    'project_id' => $project->id,
                    'user_id'    => $uid,
                ], $memberIds);

                if (!empty($rows)) {
                    DB::table('project_members')->insert($rows);
                }
            }
        }
    }
}
