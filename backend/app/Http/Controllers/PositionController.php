<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PositionService;

class PositionController extends Controller
{
    function getPositions()
    {
        try {
            $positions = PositionService::getPositions();
            if (!$positions)
                return $this->error('Positions Not Found');
            return $this->success($positions);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
