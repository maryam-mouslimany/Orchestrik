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
            return $this->success($result, 'Successfully Recommended.');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

}
