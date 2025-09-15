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
 *   bearerFormat="JWT",
 *   description="Click Authorize and paste ONLY the token (no 'Bearer ' prefix)."
 * )
 *
 * @OA\OpenApi(
 *   security={{"bearerAuth": {}}}
 * )
 *
 * @OA\Server(
 *   url="/",
 *   description="App root"
 * )
 *
 * @OA\Tag(name="Common", description="Endpoints available to any authenticated user.")
 * @OA\Tag(name="Admin", description="Admin-only endpoints.")
 * @OA\Tag(name="Project Manager", description="PM endpoints.")
 * @OA\Tag(name="Employee", description="Employee endpoints.")
 * @OA\Tag(name="Auth", description="Authentication endpoints.")
 */
final class OpenApiSpec {}
