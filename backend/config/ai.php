<?php

return [
    'driver' => env('AI_DRIVER', 'gemini'),

    'gemini' => [
        'key'   => env('GEMINI_API_KEY'),
        'base'  => rtrim(env('GEMINI_BASE', 'https://generativelanguage.googleapis.com'), '/'),
        'model' => env('GEMINI_MODEL', 'gemini-1.5-pro'),
    ],

];
