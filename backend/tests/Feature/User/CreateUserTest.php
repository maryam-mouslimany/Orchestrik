<?php

use App\Models\User;
use App\Models\Skill;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Testing\Fluent\AssertableJson;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

function usersStoreUrl(): string
{
    return '/api/admin/users/create';
}

function authHeaders(User $user): array
{
    $token = JWTAuth::fromUser($user);
    return ['Authorization' => "Bearer {$token}"];
}

function makeAdmin(): User
{
    $adminRoleId = DB::table('roles')->where('name', 'Admin')->value('id') ?? DB::table('roles')->first()->id;
    $positionId  = DB::table('positions')->first()->id;

    return User::factory()->create([
        'name'              => 'Admin',
        'email'             => 'admin@example.com',
        'email_verified_at' => now(),
        'password'          => Hash::make('Admin!123'),
        'role_id'           => $adminRoleId,
        'position_id'       => $positionId,
    ]);
}

it('creates a user and attaches skills (201 or 200)', function () {
    $admin = makeAdmin();

    $roleId     = DB::table('roles')->where('name', 'Employee')->value('id') ?? DB::table('roles')->first()->id;
    $positionId = DB::table('positions')->first()->id;

    $skills = Skill::query()->take(2)->pluck('id')->all();
    if (count($skills) < 2) {
        $skills = Skill::factory()->count(2)->create()->pluck('id')->all();
    }

    $payload = [
        'name'        => 'New Person',
        'email'       => 'new.person@example.com',
        'password'    => 'Passw0rd!',
        'role_id'     => $roleId,
        'position_id' => $positionId,
        'skills'      => $skills,
    ];

    $res = $this->withHeaders(authHeaders($admin))
                ->postJson(usersStoreUrl(), $payload);

    expect([200, 201])->toContain($res->getStatusCode());

    $res->assertJson(fn (AssertableJson $json) =>
        $json->has('status')
             ->has('data', fn ($u) =>
                 $u->where('email', 'new.person@example.com')
                   ->has('role')
                   ->has('position')
                   ->has('skills', count($skills))
                   ->etc()
             )
             ->has('message')
             ->etc()
    );

    $created = User::where('email', 'new.person@example.com')->firstOrFail();
    expect(Hash::check('Passw0rd!', $created->password))->toBeTrue();
    expect($created->skills()->pluck('skills.id')->sort()->values()->all())
        ->toEqualCanonicalizing($skills);
});

it('validates payload (422)', function () {
    $admin = makeAdmin();

    $res = $this->withHeaders(authHeaders($admin))
                ->postJson(usersStoreUrl(), [
                    'name'        => '',
                    'email'       => 'not-an-email',
                    'password'    => '123',   
                    'role_id'     => 999999,  
                    'position_id' => 999999,  
                    'skills'      => ['x'],   
                ]);

    $res->assertStatus(422)
        ->assertJsonValidationErrors([
            'name',
            'email',
            'password',
            'role_id',
            'position_id',
            'skills.0',  
        ]);
});

it('rejects duplicate email (422)', function () {
    $admin = makeAdmin();

    $roleId     = DB::table('roles')->first()->id;
    $positionId = DB::table('positions')->first()->id;

    User::factory()->create([
        'email'       => 'dup@example.com',
        'role_id'     => $roleId,
        'position_id' => $positionId,
    ]);

    $payload = [
        'name'        => 'Dup Name',
        'email'       => 'dup@example.com', 
        'password'    => 'Passw0rd!',
        'role_id'     => $roleId,
        'position_id' => $positionId,
        'skills'      => [],
    ];

    $res = $this->withHeaders(authHeaders($admin))
                ->postJson(usersStoreUrl(), $payload);

    $res->assertStatus(422)->assertJsonValidationErrors(['email']);
});

it('rejects invalid skill ids (422)', function () {
    $admin = makeAdmin();

    $roleId     = DB::table('roles')->first()->id;
    $positionId = DB::table('positions')->first()->id;

    $payload = [
        'name'        => 'Skill Check',
        'email'       => 'skill.check@example.com',
        'password'    => 'Passw0rd!',
        'role_id'     => $roleId,
        'position_id' => $positionId,
        'skills'      => [999999], 
    ];

    $res = $this->withHeaders(authHeaders($admin))
                ->postJson(usersStoreUrl(), $payload);

    $res->assertStatus(422)->assertJsonValidationErrors(['skills.0']);
});

