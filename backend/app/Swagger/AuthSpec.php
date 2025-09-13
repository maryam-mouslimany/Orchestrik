<?php
declare(strict_types=1);

namespace App\Swagger;

use OpenApi\Annotations as OA;

final class AuthSpec
{
    /**
     * @OA\Post(
     *   path="/api/guest/login",
     *   tags={"Auth"},
     *   summary="Login",
     *   @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/LoginRequest")),
     *   @OA\Response(response=200, description="OK", @OA\JsonContent(ref="#/components/schemas/AuthUser")),
     *   @OA\Response(response=401, description="Invalid credentials"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function login(): void {}

    /**
     * @OA\Get(
     *   path="/api/auth/validate",
     *   tags={"Auth"},
     *   summary="Validate token",
     *   security={{"bearerAuth": {}}},
     *   @OA\Response(response=200, description="Valid token", @OA\JsonContent(ref="#/components/schemas/AuthUser")),
     *   @OA\Response(response=401, description="Invalid token")
     * )
     */
    public function validateToken(): void {}
}
