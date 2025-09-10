<?php

namespace App\Services\Agent\LLM;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Arr;

class GeminiClient implements LLMClient
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $base,
        private readonly string $model,
    ) {}

    public function chat(array $messages, array $options = []): string
    {
        // Map OpenAI-style messages → Gemini "contents"
        $contents = [];
        foreach ($messages as $m) {
            $role = match ($m['role'] ?? 'user') {
                'assistant' => 'model',
                default     => 'user', // fold 'system' into 'user'
            };
            $contents[] = [
                'role'  => $role,
                'parts' => [['text' => (string)($m['content'] ?? '')]],
            ];
        }

        $generationConfig = array_merge([
            // 'responseMimeType' => 'application/json', // enable if you want strict JSON
        ], Arr::get($options, 'generationConfig', []));

        $url = rtrim($this->base, '/')."/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}";

        $res = Http::withHeaders(['Content-Type' => 'application/json'])
            ->post($url, array_filter([
                'contents'         => $contents,
                'generationConfig' => (object) $generationConfig,
            ]))
            ->throw();

        return (string) data_get($res->json(), 'candidates.0.content.parts.0.text', '');
    }
}
