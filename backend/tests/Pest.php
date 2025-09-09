<?php

use Tests\TestCase;

// Make Pest bind to Laravel's base TestCase
uses(TestCase::class)->in('Feature', 'Unit');

// Optional helper for login URL
if (!function_exists('loginUrl')) {
    function loginUrl(): string
    {
        return '/api/guest/login'; // adjust if route differs
    }
}
