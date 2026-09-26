<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class AIService
{
    public function ask(string $prompt): string
    {
        $response = Http::post(env('OLLAMA_URL') . '/api/generate', [
            'model' => 'llama3',
            'prompt' => $prompt,
            'stream' => false
        ]);

        return $response['response'] ?? 'No response';
    }
}
