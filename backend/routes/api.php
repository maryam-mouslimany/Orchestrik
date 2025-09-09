<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjetController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\AgentController;

//Unauthenticated APIs
Route::group(["prefix" => "guest"], function () {
    Route::post("/login", [AuthController::class, "login"]);
});

//Authenticated Apis
Route::middleware(['auth'])->group(function () {
    Route::get("/projects", [ProjetController::class, "getProjects"]);
    Route::get("/skills", [SkillController::class, "getSkills"]);
    Route::get("/positions", [PositionController::class, "getPositions"]);
    Route::get("/roles", [RoleController::class, "getRoles"]);
    Route::get("/clients", [ClientController::class, "getClients"]);

    Route::post("/tasks/editStatus/{taskId}", [TaskController::class, "editStatus"]);


    Route::prefix('agent')->group(function () {
        Route::post('/reopened-tasks', [AgentController::class, 'reopenedTasks']);
    });

    Route::prefix('admin')->middleware(RoleMiddleware::class . ':admin')->group(function () {
        Route::post("/projects/create", [ProjetController::class, "createProject"]);
        Route::get("/users", [UserController::class, "getUsers"]);
        Route::post("/users/create", [UserController::class, "createUser"]);
        Route::post("/tasks/create/{parentTask?}", [TaskController::class, "createTask"]);
    });
});
