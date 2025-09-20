<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ProjectAnalyticsService;

class ProjectAnalyticsController extends Controller
{
    public function getTaskStatusBreakdown(Request $request)
    {
        try {
            $data = ProjectAnalyticsService::taskStatusBreakdown($request);
            if ($data === null) {
                return $this->error('Project not found', 404);
            }
            return $this->success($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function completedOnTimeVsOverdue(Request $request)
    {
        try {
            $data = ProjectAnalyticsService::completedOnTimeVsOverdue($request);
            if ($data === null) {
                return $this->error('Project not found', 404);
            }
            return $this->success($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function getProjectReopenRate(Request $request)
    {
        try {
            $data = ProjectAnalyticsService::getProjectReopenRate($request);
            if ($data === null) {
                return $this->error('Project not found', 404);
            }
            return $this->success($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
