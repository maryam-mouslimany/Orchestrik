<?php

namespace App\Services;
use App\Models\Position;

class PositionService
{
    static function getPositions(){
            return position::all();
        }
}
