<?php

namespace App\Http\Controllers;

use App\Services\Agent\LLM\LLMClient;
use App\Services\Agent\AssigneeRecommenderService;
use App\Http\Requests\RecommendAssigneeRequest;

class AgentController extends Controller
{

    public function recommend(RecommendAssigneeRequest $request)
    {
        try {
            $result = AssigneeRecommenderService::recommend($request->validated());
            return $this->success($result, 'Successfully Logged In.');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

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
