<?php
declare(strict_types=1);

namespace App\Swagger;

use OpenApi\Annotations as OA;

final class AdminSpec
{
    /**
     * @OA\Post(
     *   path="/api/admin/projects/create",
     *   tags={"Admin"},
     *   summary="Create a project",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"name","description","client_id","members"},
     *       @OA\Property(property="name", type="string", example="Website Revamp"),
     *       @OA\Property(property="description", type="string", example="Full redesign of marketing site"),
     *       @OA\Property(property="client_id", type="integer", example=3),
     *       @OA\Property(
     *         property="members",
     *         type="array",
     *         @OA\Items(type="integer", example=12),
     *         description="User IDs to attach to the project"
     *       )
     *     )
     *   ),
     *   @OA\Response(response=201, description="Created"),
     *   @OA\Response(response=401, description="Unauthorized"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function createProject(): void {}

    /**
     * @OA\Post(
     *   path="/api/admin/users/create",
     *   tags={"Admin"},
     *   summary="Create a user",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"name","email","password","position_id","role_id","skills"},
     *       @OA\Property(property="name", type="string", example="Maryam M."),
     *       @OA\Property(property="email", type="string", format="email", example="maryam@example.com"),
     *       @OA\Property(property="password", type="string", minLength=6, example="secret123"),
     *       @OA\Property(property="position_id", type="integer", example=5),
     *       @OA\Property(property="role_id", type="integer", example=2),
     *       @OA\Property(
     *         property="skills",
     *         type="array",
     *         @OA\Items(type="integer", example=7),
     *         description="Array of skill IDs"
     *       )
     *     )
     *   ),
     *   @OA\Response(response=201, description="Created"),
     *   @OA\Response(response=401, description="Unauthorized"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function createUser(): void {}

    /**
     * @OA\Post(
     *   path="/api/admin/users/delete",
     *   tags={"Admin"},
     *   summary="Soft-delete a user",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"id"},
     *       @OA\Property(property="id", type="integer", example=42, description="User ID to soft delete")
     *     )
     *   ),
     *   @OA\Response(response=200, description="Deleted"),
     *   @OA\Response(response=401, description="Unauthorized"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function deleteUser(): void {}

    /**
     * @OA\Post(
     *   path="/api/admin/users/restore",
     *   tags={"Admin"},
     *   summary="Restore a soft-deleted user",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"id"},
     *       @OA\Property(property="id", type="integer", example=42, description="Previously deleted user ID")
     *     )
     *   ),
     *   @OA\Response(response=200, description="Restored"),
     *   @OA\Response(response=401, description="Unauthorized"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function restoreUser(): void {}

    /**
     * @OA\Get(
     *   path="/api/admin/analytics/tasks/durations",
     *   tags={"Admin"},
     *   summary="Analytics: top/least task durations",
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=401, description="Unauthorized"),
     *   @OA\Response(response=403, description="Forbidden")
     * )
     */
    public function analyticsTasksDurations(): void {}

    /**
     * @OA\Get(
     *   path="/api/admin/analytics/employees/workload",
     *   tags={"Admin"},
     *   summary="Analytics: employees workload",
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=401, description="Unauthorized"),
     *   @OA\Response(response=403, description="Forbidden")
     * )
     */
    public function analyticsEmployeesWorkload(): void {}

    /**
     * @OA\Get(
     *   path="/api/admin/analytics/employees/positions",
     *   tags={"Admin"},
     *   summary="Analytics: positions distribution",
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=401, description="Unauthorized"),
     *   @OA\Response(response=403, description="Forbidden")
     * )
     */
    public function analyticsPositionsDistribution(): void {}

    /**
     * @OA\Get(
     *   path="/api/admin/analytics/employees/skills",
     *   tags={"Admin"},
     *   summary="Analytics: skills distribution",
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=401, description="Unauthorized"),
     *   @OA\Response(response=403, description="Forbidden")
     * )
     */
    public function analyticsSkillsDistribution(): void {}
}
