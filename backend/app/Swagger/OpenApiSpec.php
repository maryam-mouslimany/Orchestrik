<?php
declare(strict_types=1);

namespace App\Swagger;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *   title="Task Management API",
 *   version="1.0.0",
 *   description="Internal API documentation"
 * )
 *
 * @OA\SecurityScheme(
 *   securityScheme="bearerAuth",
 *   type="http",
 *   scheme="bearer",
 *   bearerFormat="JWT"
 * )
 *
 * @OA\Server(url="/",    description="App root")
 * @OA\Server(url="/api", description="API base")
 *
 * @OA\Tag(name="Admin", description="Admin-only endpoints")
 * @OA\Tag(name="Auth",  description="Authentication endpoints")
 *
 * --------------- SCHEMAS ---------------
 *
 * @OA\Schema(
 *   schema="LoginRequest",
 *   type="object",
 *   required={"email","password"},
 *   @OA\Property(property="email", type="string", format="email"),
 *   @OA\Property(property="password", type="string", minLength=6)
 * )
 *
 * @OA\Schema(
 *   schema="Role",
 *   type="object",
 *   @OA\Property(property="id", type="integer"),
 *   @OA\Property(property="name", type="string")
 * )
 *
 * @OA\Schema(
 *   schema="Position",
 *   type="object",
 *   @OA\Property(property="id", type="integer"),
 *   @OA\Property(property="name", type="string")
 * )
 *
 * @OA\Schema(
 *   schema="Skill",
 *   type="object",
 *   @OA\Property(property="id", type="integer"),
 *   @OA\Property(property="name", type="string")
 * )
 *
 * @OA\Schema(
 *   schema="AuthUser",
 *   type="object",
 *   @OA\Property(property="token", type="string", description="JWT token"),
 *   @OA\Property(
 *     property="user",
 *     type="object",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="email", type="string", format="email"),
 *     @OA\Property(property="role", ref="#/components/schemas/Role"),
 *     @OA\Property(property="position", ref="#/components/schemas/Position"),
 *     @OA\Property(
 *       property="skills",
 *       type="array",
 *       @OA\Items(ref="#/components/schemas/Skill")
 *     )
 *   )
 * )
 */
final class OpenApiSpec {}
