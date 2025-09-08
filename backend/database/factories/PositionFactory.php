<?php

namespace Database\Factories;

use App\Models\Position;                  
use Illuminate\Database\Eloquent\Factories\Factory;

class PositionFactory extends Factory
{
    protected $model = Position::class;       

    public function definition(): array
    {
        return [
            'name'        => 'Developer',
            // include only real NOT NULL columns in your positions table:
            'code'        => 'DEV',
            'slug'        => 'developer',
            'description' => 'Default position',
        ];
    }
}
