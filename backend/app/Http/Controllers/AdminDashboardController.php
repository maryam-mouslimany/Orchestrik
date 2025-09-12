<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AdminDashboardService;

class AdminDashboardController extends Controller
{
    function getTopAndLeastCompletedDurations()
    {
        try {
            $res = AdminDashboardService::getTopAndLeastCompletedDurations();
            if (!$res)
                return $this->error('Not Found');
            return $this->success($res);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    function employeesWorkload()
    {
        try {
            $res = AdminDashboardService::employeesWorkload();
            if (!$res)
                return $this->error('Not Found');
            return $this->success($res);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    function positionsDistribution()
    {
        try {
            $res = AdminDashboardService::positionsDistribution();
            if (!$res)
                return $this->error('Not Found');
            return $this->success($res);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    function skillsDistribution()
    {
        try {
            $res = AdminDashboardService::skillsDistribution();
            if (!$res)
                return $this->error('Not Found');
            return $this->success($res);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
