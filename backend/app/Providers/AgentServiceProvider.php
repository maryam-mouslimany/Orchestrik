<?php

namespace App\Providers;

use App\Services\Agent\LLM\LLMClient;
use App\Services\Agent\LLM\GeminiClient;
use Illuminate\Support\ServiceProvider;

class AgentServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $cfg = config('ai.gemini');

        $this->app->bind(LLMClient::class, function () use ($cfg) {
            return new GeminiClient(
                apiKey: (string) ($cfg['key'] ?? ''),
                base:   (string) ($cfg['base'] ?? 'https://generativelanguage.googleapis.com'),
                model:  (string) ($cfg['model'] ?? 'gemini-1.5-pro'),
            );
        });
    }
}
