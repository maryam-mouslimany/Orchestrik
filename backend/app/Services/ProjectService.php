<?php

namespace App\Services;

use App\Models\Project;
use App\Events\ProjectCreated;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ProjectService
{
    static function getProjects()
    {
        $user = Auth::user();

        if ($user->role->name === 'admin') {
            return Project::where('created_by', $user->id)->with(['creator', 'client', 'members'])->get();
        }
        return $user->projects()->with(['creator', 'client', 'members'])->get();
    }

    static function createProject($data)
    {
        $project = Project::create([
            'name' => $data['name'],
            'description' => $data['description'],
            'status' => $data['status'],
            'client_id' => $data['client_id'],
            'created_by' => Auth::user()->id,
        ]);

        $project->members()->attach($data['members']);
        $project->load(['creator', 'client', 'members']);
        DB::afterCommit(function () use ($project, $data) {
            event(new ProjectCreated($project, $data));   
        });
        return $project->get();
    }
}
