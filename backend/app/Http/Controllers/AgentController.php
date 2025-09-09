<?php

namespace App\Http\Controllers;

use App\Services\AgentService;
use Illuminate\Http\Request;

class AgentController extends Controller
{

    /**
     * POST /api/agent/reopened-tasks
     * Body: { "project_id": 123, "limit": 20 }
     */
    public function reopenedTasks(Request $request)
    {
        try {
            $projectId = $request->has('project_id') ? $request->integer('project_id') : null;
            $limit     = $request->has('limit') ? max(1, min(100, (int)$request->input('limit'))) : 20;

            $data = AgentService::reopenedTasks($projectId, $limit);

            // ⬇️ use your trait’s success method name/signature
            return $this->success($data, 'Reopened tasks analysis ready.', 200);
        } catch (\Throwable $e) {
            // ⬇️ use your trait’s error method name/signature
            return $this->error($e->getMessage(), 500);
        }
    }
}
