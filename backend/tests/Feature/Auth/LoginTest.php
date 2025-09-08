<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\Fluent\AssertableJson;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Run your DatabaseSeeder before each test
    $this->seed();
});

it('logs in with valid credentials and returns token + relations', function () {
    // Get seeded role and position IDs
    $roleId = DB::table('roles')->first()->id;
    $positionId = DB::table('positions')->first()->id;

    // Create a user linked to seeded data
    User::factory()->create([
        'name'              => 'Test User',
        'email'             => 'test@example.com',
        'email_verified_at' => now(),
        'password'          => Hash::make('Passw0rd!'),
        'role_id'           => $roleId,
        'position_id'       => $positionId,
    ]);

    $res = $this->postJson(loginUrl(), [
        'email'    => 'test@example.com',
        'password' => 'Passw0rd!',
    ]);

    $res->assertStatus(200)
        ->assertJson(fn (AssertableJson $json) =>
            $json->has('status')
                ->has('data', fn ($u) =>
                    $u->where('email', 'test@example.com')->has('token')->etc()
                )
                ->where('message', 'Successfully Logged In.')
                ->etc()
        );
});

it('rejects wrong credentials with 401', function () {
    $roleId = DB::table('roles')->first()->id;
    $positionId = DB::table('positions')->first()->id;

    User::factory()->create([
        'name'              => 'Wrong User',
        'email'             => 'wrong@example.com',
        'email_verified_at' => now(),
        'password'          => Hash::make('Correct!123'),
        'role_id'           => $roleId,
        'position_id'       => $positionId,
    ]);

    $res = $this->postJson(loginUrl(), [
        'email'    => 'wrong@example.com',
        'password' => 'Nope!!',
    ]);

    $res->assertStatus(401)
        ->assertJson(fn (AssertableJson $json) =>
            $json->has('status')
                ->where('message', 'Invalid credentials')
                ->etc()
        );
});

it('validates payload and returns 422 for bad input', function () {
    $res = $this->postJson(loginUrl(), [
        'email' => 'not-an-email',
    ]);

    $res->assertStatus(422)
        ->assertJsonValidationErrors(['email', 'password']);
});
