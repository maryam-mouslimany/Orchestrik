<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ProjectService;
use App\Http\Requests\StoreProjectRequest;

class ProjetController extends Controller
{
    function getProjects()
    {
        try {
            $projects = ProjectService::getProjects();
            if (!$projects)
                return $this->error('Projects Not Found');
            return $this->success($projects);
        } catch (\Exception $e) {
            return $this->error('Something went wrong', 500);
        }
    }

    function createProject(StoreProjectRequest $request)
    {
        try {
            $project = ProjectService::createProject($request->validated());
            if (!$project)
                return $this->error('Project Not Created');
            return $this->success($project);
        } catch (\Exception $e) {
            return $this->error('Something went wrong', 500);
        }
    }
}
