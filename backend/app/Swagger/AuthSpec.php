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
 *   @OA\RequestBody(
 *     required=true,
 *     @OA\JsonContent(
 *       type="object",
 *       required={"email","password"},
 *       @OA\Property(property="email", type="string", format="email", example="user@example.com"),
 *       @OA\Property(property="password", type="string", minLength=6, example="secret123")
 *     )
 *   ),
 *   @OA\Response(response=200, description="OK (returns token and user)"),
 *   @OA\Response(response=401, description="Invalid credentials"),
 *   @OA\Response(response=422, description="Validation error")
 * )
 */
public function login(): void {}


}
