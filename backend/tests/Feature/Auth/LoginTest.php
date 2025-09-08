<?php

use App\Models\Position;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\Fluent\AssertableJson;

uses(RefreshDatabase::class);

it('logs in with valid credentials and returns token + relations', function () {
    $role = Role::factory()->create();
    $position = Position::factory()->create();

    $user = \App\Models\User::factory()->create([
        'name'              => 'Test User',
        'email'             => 'test@example.com',
        'email_verified_at' => now(),
        'password'          => Hash::make('Passw0rd!'),
        'role_id'           => $role->id,
        'position_id'       => $position->id,
    ]);

    $res = $this->postJson(loginUrl(), [
        'email'    => 'test@example.com',
        'password' => 'Passw0rd!',
    ]);

    $res->assertStatus(200)
        ->assertJson(fn (AssertableJson $json) =>
            $json
                ->has('status')
                ->has('data', fn ($u) =>
                    $u->where('email', 'test@example.com')
                      ->has('token')
                      ->etc()
                )
                ->where('message', 'Successfully Logged In.')
                ->etc()
        );

    $token = data_get($res->json(), 'data.token');
    expect((is_string($token) && $token !== '') || $token === true)->toBeTrue();
});

it('rejects wrong credentials with 401', function () {
    $role = Role::factory()->create();
    $position = Position::factory()->create();

    \App\Models\User::factory()->create([
        'name'              => 'Wrong User',
        'email'             => 'wrong@example.com',
        'email_verified_at' => now(),
        'password'          => Hash::make('Correct!123'),
        'role_id'           => $role->id,
        'position_id'       => $position->id,
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
