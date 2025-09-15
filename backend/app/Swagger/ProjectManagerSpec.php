<?php
declare(strict_types=1);

namespace App\Swagger;

use OpenApi\Annotations as OA;

final class ProjectManagerSpec
{
    /**
     * @OA\Post(
     *   path="/api/pm/recommend-assignee",
     *   tags={"Project Manager"},
     *   summary="Recommend an assignee for a task (AI)",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"project_id","title"},
     *       @OA\Property(property="project_id", type="integer", example=15),
     *       @OA\Property(property="title", type="string", example="Build login page"),
     *       @OA\Property(property="description", type="string", example="React form, validation, API wiring")
     *     )
     *   ),
     *   @OA\Response(response=200, description="OK (returns recommended user + why)"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function recommendAssignee(): void {}

    /**
     * NOTE: Your route is defined with an optional path param `{projectId?}`.
     * OpenAPI does not support optional path params; this spec treats it as required.
     *
     * @OA\Get(
     *   path="/api/pm/projects/members/{projectId}",
     *   tags={"Project Manager"},
     *   summary="Get PM and members for a project",
     *   @OA\Parameter(
     *     name="projectId",
     *     in="path",
     *     required=true,
     *     description="Project ID",
     *     @OA\Schema(type="integer", example=15, minimum=1)
     *   ),
     *   @OA\Response(response=200, description="OK (pm + members array)"),
     *   @OA\Response(response=404, description="Project not found or access denied"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function projectMembers(): void {}

    /**
     * @OA\Post(
     *   path="/api/pm/tasks/create",
     *   tags={"Project Manager"},
     *   summary="Create a task",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"project_id","assigned_to","title"},
     *       @OA\Property(property="project_id", type="integer", example=15),
     *       @OA\Property(property="assigned_to", type="integer", example=23, description="User ID of assignee"),
     *       @OA\Property(property="title", type="string", example="Implement task table"),
     *       @OA\Property(property="description", type="string", example="Paginated table with filters"),
     *       @OA\Property(property="priority", type="string", example="high"),
     *       @OA\Property(property="deadline", type="string", format="date-time", example="2025-09-30T17:00:00Z"),
     *       @OA\Property(property="status", type="string", example="pending")
     *     )
     *   ),
     *   @OA\Response(response=201, description="Created (returns created task)"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function createTask(): void {}

    /**
     * @OA\Get(
     *   path="/api/pm/tasks",
     *   tags={"Project Manager"},
     *   summary="List tasks (PM view, with filters and optional pagination)",
     *   @OA\Parameter(
     *     name="projectId", in="query", required=false,
     *     @OA\Schema(type="integer", example=15)
     *   ),
     *   @OA\Parameter(
     *     name="assigned_to", in="query", required=false,
     *     description="One or more assignee IDs",
     *     style="form", explode=true,
     *     @OA\Schema(oneOf={
     *       @OA\Schema(type="integer", example=23),
     *       @OA\Schema(type="array", @OA\Items(type="integer", example=23))
     *     })
     *   ),
     *   @OA\Parameter(
     *     name="status", in="query", required=false,
     *     description="One or more statuses",
     *     style="form", explode=true,
     *     @OA\Schema(oneOf={
     *       @OA\Schema(type="string", example="in_progress"),
     *       @OA\Schema(type="array", @OA\Items(type="string", example="completed"))
     *     })
     *   ),
     *   @OA\Parameter(
     *     name="priority", in="query", required=false,
     *     description="One or more priorities",
     *     style="form", explode=true,
     *     @OA\Schema(oneOf={
     *       @OA\Schema(type="string", example="high"),
     *       @OA\Schema(type="array", @OA\Items(type="string", example="medium"))
     *     })
     *   ),
     *   @OA\Parameter(
     *     name="page", in="query", required=false,
     *     description="Page number (when paginating)",
     *     @OA\Schema(type="integer", example=1, minimum=1)
     *   ),
     *   @OA\Parameter(
     *     name="per_page", in="query", required=false,
     *     description="Items per page (1..100)",
     *     @OA\Schema(type="integer", example=20, minimum=1, maximum=100)
     *   ),
     *   @OA\Response(response=200, description="OK (paginated or full list)"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function listTasks(): void {}

    /**
     * NOTE: Your route has an optional `{taskId?}`; OpenAPI treats path params as required.
     *
     * @OA\Get(
     *   path="/api/pm/tasks/{taskId}",
     *   tags={"Project Manager"},
     *   summary="Get task details by ID",
     *   @OA\Parameter(
     *     name="taskId",
     *     in="path",
     *     required=true,
     *     @OA\Schema(type="integer", example=123)
     *   ),
     *   @OA\Response(response=200, description="OK (task object or null)"),
     *   @OA\Response(response=404, description="Task not found")
     * )
     */
    public function taskDetails(): void {}
}
