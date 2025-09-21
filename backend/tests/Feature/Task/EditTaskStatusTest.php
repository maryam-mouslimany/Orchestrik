<?php

declare(strict_types=1);

use App\Models\User;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});


function editTaskUrl(int|string $id): string
{
    return "/api/tasks/editStatus/{$id}";
}


function asJwt(User $user): void
{
    $token = JWTAuth::fromUser($user);
    test()->withHeader('Authorization', "Bearer {$token}");
}

function makeUserWithRole(string $roleName): User
{
    $role = DB::table('roles')->where('name', $roleName)->first();
    if (!$role) {
        test()->fail("Role '{$roleName}' not found in seeders.");
    }

    $user = User::query()->where('role_id', $role->id)->first();
    if ($user) {
        return $user;
    }

    $positionId = DB::table('positions')->value('id') ?? null;

    $payload = [
        'name'              => Str::title($roleName) . ' Test',
        'email'             => $roleName . '+test_' . Str::random(6) . '@example.com',
        'email_verified_at' => now(),
        'role_id'           => $role->id,
        'position_id'       => $positionId,
        'password'          => 'dummy',
    ];

    return User::unguarded(fn() => User::create($payload));
}


function makeTask(string $status = 'pending', ?User $assignee = null): Task
{
    $projectId = DB::table('projects')->value('id');
    if (!$projectId) test()->fail('No projects found from seeders.');

    if (!$assignee) {
        $assignee = User::first() ?? test()->fail('No users found from seeders.');
    }

    $adminId = DB::table('users')
        ->join('roles', 'roles.id', '=', 'users.role_id')
        ->where('roles.name', 'admin')   
        ->value('users.id');

    $createdBy = $adminId ?: $assignee->id;

    $data = [
        'title'        => 'Seeded Task',
        'description'  => 'Created in test without factories',
        'status'       => $status,
        'duration'     => null,
        'project_id'   => $projectId,    
        'assigned_to'  => $assignee->id, 
        'priority'     => 'medium',      
        'created_by'   => $createdBy,    
    ];

    return Task::unguarded(fn() => Task::create($data));
}


it('employee can set status to "in progress"', function () {
    $employee = makeUserWithRole('employee');
    $task = makeTask('pending', $employee);

    asJwt($employee);
    $res = $this->postJson(editTaskUrl($task->id), [
        'status' => 'in progress',
    ]);

    $res->assertStatus(200);

    $this->assertDatabaseHas('tasks', [
        'id'     => $task->id,
        'status' => 'in progress',
    ]);

    $this->assertDatabaseHas('task_status_logs', [
        'task_id'     => $task->id,
        'from_status' => 'pending',
        'to_status'   => 'in progress',
        'changed_by'  => $employee->id,
    ]);
});

it('employee must provide note + duration to complete', function () {
    $employee = makeUserWithRole('employee');
    $task = makeTask('in progress', $employee);

    asJwt($employee);
    $res1 = $this->postJson(editTaskUrl($task->id), [
        'status' => 'completed',
    ]);
    $res1->assertStatus(422)->assertJsonValidationErrors(['note', 'duration']);

    asJwt($employee);
    $res2 = $this->postJson(editTaskUrl($task->id), [
        'status' => 'completed',
        'note'   => 'Wrapping up work',
    ]);
    $res2->assertStatus(422)->assertJsonValidationErrors(['duration']);

    asJwt($employee);
    $res3 = $this->postJson(editTaskUrl($task->id), [
        'status'   => 'completed',
        'note'     => 'All done',
        'duration' => '3h 15m',
    ]);
    $res3->assertStatus(200);

    $this->assertDatabaseHas('tasks', [
        'id'       => $task->id,
        'status'   => 'completed',
        'duration' => '3h 15m',
    ]);

    $this->assertDatabaseHas('task_status_logs', [
        'task_id'     => $task->id,
        'from_status' => 'in progress',
        'to_status'   => 'completed',
        'changed_by'  => $employee->id,
        'note'        => 'All done',
    ]);
});

it('employee cannot reopen (403 from FormRequest authorize)', function () {
    $employee = makeUserWithRole('employee');
    $task = makeTask('completed', $employee);

    asJwt($employee);
    $res = $this->postJson(editTaskUrl($task->id), [
        'status' => 'reopened',
        'note'   => 'Needs fixes',
    ]);

    $res->assertStatus(403);
});

it('pm can reopen but note is required', function () {
    $pm = makeUserWithRole('pm');
    $task = makeTask('completed', $pm);

    asJwt($pm);
    $res1 = $this->postJson(editTaskUrl($task->id), [
        'status' => 'reopened',
    ]);
    $res1->assertStatus(422)->assertJsonValidationErrors(['note']);


    asJwt($pm);
    $res2 = $this->postJson(editTaskUrl($task->id), [
        'status' => 'reopened',
        'note'   => 'Found an issue; reopening',
    ]);
    $res2->assertStatus(200);

    $this->assertDatabaseHas('tasks', [
        'id'     => $task->id,
        'status' => 'reopened',
    ]);

    $this->assertDatabaseHas('task_status_logs', [
        'task_id'     => $task->id,
        'from_status' => 'completed',
        'to_status'   => 'reopened',
        'changed_by'  => $pm->id,
        'note'        => 'Found an issue; reopening',
    ]);
});

it('returns 500 with generic error when task not found', function () {
    $pm = makeUserWithRole('pm');
    asJwt($pm);

    $missingId = 999999;

    $res = $this->postJson(editTaskUrl($missingId), [
        'status' => 'in progress',
    ]);

   $res->assertStatus(500)
    ->assertJson([
        'status'  => 'error',           
        'message' => 'Something went wrong',
        'errors'  => null,             
    ]);

});
