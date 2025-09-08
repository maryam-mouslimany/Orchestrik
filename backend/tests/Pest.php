<?php

use App\Models\Role;
use App\Models\Position;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\Fluent\AssertableJson;

uses(RefreshDatabase::class);

function loginUrl(): string
{
    return '/api/guest/login';
}
it('logs in with valid credentials and returns token + relations', function () {
    $role = Role::factory()->create();
    $position = Position::factory()->create();

    User::factory()->create([
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
        ->assertJson(
            fn(AssertableJson $json) =>
            $json->has('status')
                ->has(
                    'data',
                    fn($u) =>
                    $u->where('email', 'test@example.com')->has('token')->etc()
                )
                ->where('message', 'Successfully Logged In.')
                ->etc()
        );

});
