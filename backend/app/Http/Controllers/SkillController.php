<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SkillService;

class SkillController extends Controller
{
    function getSkills()
    {
        try {
            $skills = SkillService::getSkills();
            if (!$skills)
                return $this->error('Skills Not Created');
            return $this->success($skills);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
