<?php
declare(strict_types=1);

namespace App\Swagger;

use OpenApi\Annotations as OA;

final class CommonSpec
{
    /**
     * @OA\Get(
     *   path="/api/skills",
     *   tags={"Common"},
     *   summary="List all skills",
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function getSkills(): void {}

    /**
     * @OA\Get(
     *   path="/api/positions",
     *   tags={"Common"},
     *   summary="List all positions",
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function getPositions(): void {}

    /**
     * @OA\Get(
     *   path="/api/roles",
     *   tags={"Common"},
     *   summary="List all roles",
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function getRoles(): void {}

    /**
     * @OA\Get(
     *   path="/api/clients",
     *   tags={"Common"},
     *   summary="List all clients",
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function getClients(): void {}

    /**
     * @OA\Get(
     *   path="/api/projects",
     *   tags={"Common"},
     *   summary="List projects for the current user",
     *   @OA\Parameter(
     *     name="name",
     *     in="query",
     *     required=false,
     *     description="Filter by project name (partial). Alias: nameFilter",
     *     @OA\Schema(type="string", example="Website")
     *   ),
     *   @OA\Parameter(
     *     name="nameFilter",
     *     in="query",
     *     required=false,
     *     description="Deprecated alias for 'name'.",
     *     @OA\Schema(type="string", example="Mobile")
     *   ),
     *   @OA\Parameter(
     *     name="withTaskStats",
     *     in="query",
     *     required=false,
     *     description="If true, include task counts (total, pending, completed, overdue).",
     *     @OA\Schema(type="boolean", example=true)
     *   ),
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function getProjects(): void {}

    /**
     * @OA\Post(
     *   path="/api/tasks/editStatus/{taskId}",
     *   tags={"Common"},
     *   summary="Update a task's status (and optionally log duration/note)",
     *   @OA\Parameter(
     *     name="taskId",
     *     in="path",
     *     required=true,
     *     description="Task ID to update",
     *     @OA\Schema(type="integer", example=123)
     *   ),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"status"},
     *       @OA\Property(
     *         property="status",
     *         type="string",
     *         example="in_progress",
     *         description="New status (e.g., pending, in_progress, completed)"
     *       ),
     *       @OA\Property(
     *         property="duration",
     *         type="integer",
     *         example=45,
     *         description="Optional duration to store with the task (units as in your DB)"
     *       ),
     *       @OA\Property(
     *         property="note",
     *         type="string",
     *         example="Moved to in_progress after kickoff",
     *         description="Optional note; saved in TaskStatusLog"
     *       )
     *     )
     *   ),
     *   @OA\Response(response=200, description="OK (returns updated task)"),
     *   @OA\Response(response=404, description="Task not found"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function editTaskStatus(): void {}

    /**
     * @OA\Get(
     *   path="/api/users",
     *   tags={"Common"},
     *   summary="List users (with optional filters)",
     *   @OA\Parameter(
     *     name="nameFilter",
     *     in="query",
     *     required=false,
     *     description="Filter by name (partial match).",
     *     @OA\Schema(type="string", example="maryam")
     *   ),
     *   @OA\Parameter(
     *     name="roleId",
     *     in="query",
     *     required=false,
     *     description="Filter by role ID.",
     *     @OA\Schema(type="integer", example=2)
     *   ),
     *   @OA\Parameter(
     *     name="positionId",
     *     in="query",
     *     required=false,
     *     description="Filter by position ID.",
     *     @OA\Schema(type="integer", example=5)
     *   ),
     *   @OA\Parameter(
     *     name="skills",
     *     in="query",
     *     required=false,
     *     description="Filter by multiple skill IDs. Encoded as skills=1&skills=2 (backend also accepts skills[]).",
     *     style="form",
     *     explode=true,
     *     @OA\Schema(type="array", @OA\Items(type="integer", example=7))
     *   ),
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function getUsers(): void {}

    /** ---------------------- ADDED: AUTH + NOTIFICATIONS ---------------------- */

    /**
     * @OA\Get(
     *   path="/api/auth/validate",
     *   tags={"Common"},
     *   summary="Validate the current token and return the authenticated user",
     *   @OA\Response(response=200, description="OK (user object or null)")
     * )
     */
    public function validateToken(): void {}

    /**
     * @OA\Get(
     *   path="/api/notifications",
     *   tags={"Common"},
     *   summary="List unread notifications for the current user",
     *   @OA\Response(response=200, description="OK (array of notifications)")
     * )
     */
    public function getNotifications(): void {}

    /**
     * @OA\Post(
     *   path="/api/notifications/read",
     *   tags={"Common"},
     *   summary="Mark a notification as read",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"notificationId"},
     *       @OA\Property(
     *         property="notificationId",
     *         type="string",
     *         example="f7a3b9a5-4b42-4d1f-9f5c-2c1f3f0a8e21",
     *         description="Notification ID"
     *       )
     *     )
     *   ),
     *   @OA\Response(response=200, description="OK (updated notification)")
     * )
     */
    public function markNotificationRead(): void {}

    /**
     * @OA\Get(
     *   path="/api/notifications/count",
     *   tags={"Common"},
     *   summary="Get unread notifications count for the current user",
     *   @OA\Response(response=200, description="OK (integer count)")
     * )
     */
    public function notificationsCount(): void {}
}
