// tests/Pest.php
<?php

use Tests\TestCase;

uses(TestCase::class)->in('Feature', 'Unit');

if (!function_exists('loginUrl')) {
    function loginUrl(): string { return '/api/guest/login'; }
}
