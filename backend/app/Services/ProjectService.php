<?php

namespace App\Services;

use App\Models\Project;
use App\Events\ProjectCreated;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class ProjectService
{
    static function getProjects($request)
    {
        $user = Auth::user();
        $withTaskStats = $request->boolean('withTaskStats');

        $query = ($user->role->name === 'admin')
            ? Project::where('created_by', $user->id)
            : $user->projects()->select('projects.*');

        $query->with(['creator', 'client', 'members']);

        if ($withTaskStats) {
            $now = Carbon::now();
            $query->withCount([
                'tasks as total',
                'tasks as pending' => fn($q) => $q->where('status', 'pending'),
                'tasks as completed' => fn($q) => $q->where('status', 'completed'),
                'tasks as overdue' => fn($q) => $q
                    ->where('deadline', '<', $now)
                    ->where('status', '!=', 'completed'),
            ]);
        }
        return $query->get();
    }


    static function createProject($data)
    {
        $project = Project::create([
            'name' => $data['name'],
            'description' => $data['description'],
            'status' => 'active',
            'client_id' => $data['client_id'],
            'created_by' => Auth::user()->id,
        ]);

        $project->members()->attach($data['members']);
        $project->load(['creator', 'client', 'members'])->get();

        DB::afterCommit(function () use ($project, $data) {
            event(new ProjectCreated($project, $data));
        });
        return $project;
    }

    static function projectMembers($request)
    {
        $request->validate(['projectId' => 'required|integer|min:1|exists:projects,id',]);
        $project = Project::find($request['projectId']);
        $users = $project->members()
            ->with(['position:id,name'])
            ->get(['users.id', 'users.name', 'users.email', 'users.position_id', 'users.role_id']);

        $pmUser    = $users->firstWhere('role_id', 2);
        $memberCol = $users->reject(fn($u) => (int)$u->role_id === 2);

        $pm = $pmUser ? [
            'id'       => $pmUser->id,
            'name'     => $pmUser->name,
            'email'    => $pmUser->email,
            'position' => $pmUser->position?->name,
        ] : null;

        $members = $memberCol->map(fn($u) => [
            'id'       => $u->id,
            'name'     => $u->name,
            'email'    => $u->email,
            'position' => $u->position?->name,
        ])->values();

        return [
            'pm'      => $pm,
            'members' => $members,
        ];
    }
}
