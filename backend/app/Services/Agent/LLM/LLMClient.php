<?php

namespace App\Services\Agent\LLM;

interface LLMClient
{

    public function chat(array $messages, array $options = []): string;
}
