<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

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
        return $project->load(['creator', 'client', 'members'])->get();
    }
}
