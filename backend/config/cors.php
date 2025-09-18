<?php

return [
    'paths' => [
        'api/*',
        'broadcasting/*',   // allow Echo auth
        'sanctum/csrf-cookie',
    ],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000', 'http://localhost:5173'],

    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // or explicit: Authorization, X-Socket-Id, Content-Type, Accept
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
