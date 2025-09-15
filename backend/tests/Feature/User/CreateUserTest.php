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
    // Your exact endpoint
    return '/api/admin/users/create';
}

/** Build Authorization header for JWT. */
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

/** 1) Happy path: creates user, hashes password, attaches skills, returns relations. */
it('creates a user and attaches skills (201 or 200)', function () {
    $admin = makeAdmin();

    $roleId     = DB::table('roles')->where('name', 'Employee')->value('id') ?? DB::table('roles')->first()->id;
    $positionId = DB::table('positions')->first()->id;

    // Ensure we have at least 2 valid skills
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

    // Accept either 200 or 201
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

/** 2) Validation: matches your FormRequest rules (422). */
it('validates payload (422)', function () {
    $admin = makeAdmin();

    $res = $this->withHeaders(authHeaders($admin))
                ->postJson(usersStoreUrl(), [
                    'name'        => '',
                    'email'       => 'not-an-email',
                    'password'    => '123',   // too short (<6)
                    'role_id'     => 999999,  // not exists
                    'position_id' => 999999,  // not exists
                    'skills'      => ['x'],   // not integer → triggers skills.0
                ]);

    $res->assertStatus(422)
        ->assertJsonValidationErrors([
            'name',
            'email',
            'password',
            'role_id',
            'position_id',
            'skills.0',   // do not expect top-level 'skills' here
        ]);
});

/** 3) Duplicate email (422). */
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
        'email'       => 'dup@example.com', // duplicate
        'password'    => 'Passw0rd!',
        'role_id'     => $roleId,
        'position_id' => $positionId,
        'skills'      => [],
    ];

    $res = $this->withHeaders(authHeaders($admin))
                ->postJson(usersStoreUrl(), $payload);

    $res->assertStatus(422)->assertJsonValidationErrors(['email']);
});

/** 4) Invalid skill id inside array (422). */
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
        'skills'      => [999999], // not exists
    ];

    $res = $this->withHeaders(authHeaders($admin))
                ->postJson(usersStoreUrl(), $payload);

    $res->assertStatus(422)->assertJsonValidationErrors(['skills.0']);
});

