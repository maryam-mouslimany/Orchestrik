<?php
namespace Database\Seeders;

use App\Models\User;
use App\Models\Project;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{

    public function run(): void
    {
        $createdBy = 1;
        $status    = 'active';
        $clientIds = range(1, 10);

        $PM_ROLE_ID   = 2;
        $ADMIN_USERID = 1;

        $pmUserIds = User::where('role_id', $PM_ROLE_ID)->pluck('id')->all();                 // only PMs
        $nonPmUserIds = User::where('id', '!=', $ADMIN_USERID)
            ->where('role_id', '!=', $PM_ROLE_ID)
            ->pluck('id')->all();                                                             // everyone else (no admin, no PMs)

        $pool = [
            ['title' => 'Content Creation Bundle', 'desc' => 'Monthly content calendar, copywriting, post design set, and short-form videos.'],
            ['title' => 'Performance Marketing Campaign', 'desc' => 'Paid social + search campaign with weekly optimizations and A/B testing.'],
            ['title' => 'OOH Billboard Flight', 'desc' => 'Out-of-home placements with creative adaptation and location mix recommendations.'],
            ['title' => 'SEO Retainer', 'desc' => 'Technical fixes, on-page SEO, keyword content plan, monthly reporting.'],
            ['title' => 'Influencer Campaign', 'desc' => 'Creator sourcing, briefing, post scheduling, and performance tracking.'],
            ['title' => 'Brand Refresh', 'desc' => 'Visual refresh, brand book updates, and social templates.'],
            ['title' => 'Quarterly Social Ads', 'desc' => 'Always-on Meta/TikTok with creative refresh every 3 weeks.'],
            ['title' => 'Event Coverage', 'desc' => 'Photo/video coverage, highlights edit, and live social posting.'],
            ['title' => 'YouTube Pre-Roll Set', 'desc' => '6s/15s edits, bumper variations, channel targeting plan.'],
            ['title' => 'Product Launch Sprint', 'desc' => 'Launch assets, teaser videos, landing page, 2-week ad burst.'],
        ];

        $projectsPerClient = 3;
        $pmIndex = 0;

        foreach ($clientIds as $clientId) {
            $pick = collect($pool)->shuffle()->take($projectsPerClient)->all();

            foreach ($pick as $tpl) {
                // 1) Choose exactly one PM (round-robin over actual PM users)
                $pmUserId = $pmUserIds[$pmIndex % count($pmUserIds)];
                $pmIndex++;

                $name = "Client {$clientId} – {$tpl['title']}";

                // 2) Create or get project
                $project = Project::firstOrCreate(
                    ['client_id' => $clientId, 'name' => $name],
                    [
                        'description' => $tpl['desc'],
                        'created_by'  => $createdBy,
                        'status'      => $status,
                    ]
                );

                $extraCount   = random_int(4, 8);
                $extraMembers = collect($nonPmUserIds)->shuffle()->take($extraCount)->all();

                $memberIds = array_values(array_unique(array_merge([$pmUserId], $extraMembers)));

         
                $memberIds = array_values(array_filter($memberIds, function ($uid) use ($pmUserIds, $pmUserId) {
                    if ($uid === $pmUserId) return true;
                    return !in_array($uid, $pmUserIds, true);
                }));

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
