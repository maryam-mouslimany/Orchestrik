<?php
declare(strict_types=1);

namespace App\Swagger;

use OpenApi\Annotations as OA;

final class LookupsSpec
{
    /**
     * @OA\Get(
     *   path="/api/skills",
     *   tags={"Lookups"},
     *   summary="Get skills",
     *   security={{"bearerAuth": {}}},
     *   @OA\Response(
     *     response=200,
     *     description="OK",
     *     @OA\JsonContent(
     *       type="array",
     *       @OA\Items(
     *         type="object",
     *         @OA\Property(property="id", type="integer"),
     *         @OA\Property(property="name", type="string")
     *       )
     *     )
     *   )
     * )
     */
    public function getSkills(): void {}

    /**
     * @OA\Get(
     *   path="/api/positions",
     *   tags={"Lookups"},
     *   summary="Get positions",
     *   security={{"bearerAuth": {}}},
     *   @OA\Response(
     *     response=200,
     *     description="OK",
     *     @OA\JsonContent(
     *       type="array",
     *       @OA\Items(
     *         type="object",
     *         @OA\Property(property="id", type="integer"),
     *         @OA\Property(property="name", type="string")
     *       )
     *     )
     *   )
     * )
     */
    public function getPositions(): void {}

    /**
     * @OA\Get(
     *   path="/api/roles",
     *   tags={"Lookups"},
     *   summary="Get roles",
     *   security={{"bearerAuth": {}}},
     *   @OA\Response(
     *     response=200,
     *     description="OK",
     *     @OA\JsonContent(
     *       type="array",
     *       @OA\Items(
     *         type="object",
     *         @OA\Property(property="id", type="integer"),
     *         @OA\Property(property="name", type="string")
     *       )
     *     )
     *   )
     * )
     */
    public function getRoles(): void {}

    /**
     * @OA\Get(
     *   path="/api/clients",
     *   tags={"Lookups"},
     *   summary="Get clients",
     *   security={{"bearerAuth": {}}},
     *   @OA\Response(
     *     response=200,
     *     description="OK",
     *     @OA\JsonContent(
     *       type="array",
     *       @OA\Items(
     *         type="object",
     *         @OA\Property(property="id", type="integer"),
     *         @OA\Property(property="name", type="string")
     *       )
     *     )
     *   )
     * )
     */
    public function getClients(): void {}
}
