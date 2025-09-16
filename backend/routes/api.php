<?php

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
use App\http\Controllers\AgentController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProjectAnalyticsController;

Route::group(["prefix" => "guest"], function () {
    Route::post("/login", [AuthController::class, "login"]);
});

//Authenticated Apis
Route::middleware(['jwt.auth'])->group(function () {
    Route::get("/skills", [SkillController::class, "getSkills"]);
    Route::get("/positions", [PositionController::class, "getPositions"]);
    Route::get("/roles", [RoleController::class, "getRoles"]);
  
   Route::get("/clients", [ClientController::class, "getClients"]);
    Route::get('/auth/validate', [AuthController::class, 'validateToken']);
    Route::get("/projects", [ProjetController::class, "getProjects"]);
    Route::post("/tasks/editStatus/{taskId}", [TaskController::class, "editStatus"]);
    Route::get("/users", [UserController::class, "getUsers"]);
    Route::get('/notifications', [NotificationController::class, 'getNotifications']);
    Route::post('/notifications/read', [NotificationController::class, 'markAsRead']);
    Route::get('/notifications/count', [NotificationController::class, 'count']);
    Route::get("/projects/analytics/status", [ProjectAnalyticsController::class, "getTaskStatusBreakdown"]);
    Route::get("/projects/analytics/completed-vs-overdue", [ProjectAnalyticsController::class, "completedOnTimeVsOverdue"]);

    Route::prefix('admin')->middleware(RoleMiddleware::class . ':admin')->group(function () {
        Route::post("/projects/create", [ProjetController::class, "createProject"]);

        Route::post("/users/create", [UserController::class, "createUser"]);
        Route::post("/users/restore", [UserController::class, "restore"]);
        Route::post("/users/delete", [UserController::class, "delete"]);

        Route::get("/analytics/tasks/durations", [AdminDashboardController::class, "getTopAndLeastCompletedDurations"]);
        Route::get("/analytics/employees/workload", [AdminDashboardController::class, "employeesWorkload"]);
        Route::get("/analytics/employees/positions", [AdminDashboardController::class, "positionsDistribution"]);
        Route::get("/analytics/employees/skills", [AdminDashboardController::class, "skillsDistribution"]);
    });
    Route::prefix('employee')->middleware(RoleMiddleware::class . ':employee')->group(function () {
        Route::get("/tasks", [TaskController::class, "employeeTasks"]);
        Route::get("/tasks/{taskId?}", [TaskController::class, "taskDetails"]);
    });

    Route::prefix('pm')->middleware(RoleMiddleware::class . ':pm')->group(function () {
        Route::post('/recommend-assignee', [AgentController::class, 'recommend']);
        Route::get("/projects/members/{projectId?}", [ProjetController::class, "projectMembers"]);
        Route::post("/tasks/create", [TaskController::class, "createTask"]);
        Route::get("/tasks", [TaskController::class, "employeeTasks"]);
        Route::get("/tasks/{taskId?}", [TaskController::class, "taskDetails"]);
    });
});
