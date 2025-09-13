<?php
declare(strict_types=1);

namespace App\Swagger;

use OpenApi\Annotations as OA;

final class UsersSpec
{
    /**
     * @OA\Get(
     *   path="/api/admin/users",
     *   tags={"Admin"},
     *   summary="List users",
     *   security={{"bearerAuth": {}}},
     *   @OA\Parameter(name="roleId", in="query", @OA\Schema(type="integer")),
     *   @OA\Parameter(name="positionId", in="query", @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=401, description="Unauthorized"),
     *   @OA\Response(response=403, description="Forbidden")
     * )
     */
    public function listUsers(): void {}

    /**
     * @OA\Post(
     *   path="/api/admin/users/create",
     *   tags={"Admin"},
     *   summary="Create user",
     *   security={{"bearerAuth": {}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"name","email","role_id","position_id","password"},
     *       @OA\Property(property="name", type="string"),
     *       @OA\Property(property="email", type="string", format="email"),
     *       @OA\Property(property="password", type="string", minLength=6),
     *       @OA\Property(property="role_id", type="integer"),
     *       @OA\Property(property="position_id", type="integer"),
     *       @OA\Property(property="skills", type="array", @OA\Items(type="integer"))
     *     )
     *   ),
     *   @OA\Response(response=201, description="Created"),
     *   @OA\Response(response=422, description="Validation error"),
     *   @OA\Response(response=401, description="Unauthorized"),
     *   @OA\Response(response=403, description="Forbidden")
     * )
     */
    public function createUser(): void {}
}
