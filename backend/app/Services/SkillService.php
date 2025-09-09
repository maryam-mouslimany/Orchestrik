<?php

namespace App\Services;
use App\Models\Skill;

class SkillService
{
        static function getSkills(){
            return Skill::all();
        }

}
