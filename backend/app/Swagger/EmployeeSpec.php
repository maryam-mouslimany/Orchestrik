<?php
declare(strict_types=1);

namespace App\Swagger;

use OpenApi\Annotations as OA;

final class EmployeeSpec
{
    /**
     * @OA\Get(
     *   path="/api/employee/tasks",
     *   tags={"Employee"},
     *   summary="List my tasks (filters + optional pagination)",
     *   @OA\Parameter(
     *     name="projectId", in="query", required=false,
     *     @OA\Schema(type="integer", example=15)
     *   ),
     *   @OA\Parameter(
     *     name="assigned_to", in="query", required=false,
     *     description="One or more assignee IDs (usually your own ID; supported by backend even for arrays).",
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
     *   @OA\Response(response=200, description="OK (paginated or full list)")
     * )
     */
    public function employeeTasks(): void {}

    /**
     * NOTE: Your route uses an optional path param `{taskId?}`.
     * OpenAPI cannot mark path params optional, so it is documented as required.
     *
     * @OA\Get(
     *   path="/api/employee/tasks/{taskId}",
     *   tags={"Employee"},
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
