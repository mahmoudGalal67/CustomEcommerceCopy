<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;
// class AIService
// {
//     public function ask(string $prompt): string
//     {
//         $response = Http::post(env('OLLAMA_URL') . '/api/generate', [
//             'model' => 'llama3',
//             'prompt' => $prompt,
//             'stream' => false
//         ]);

//         return $response['response'] ?? 'No response';
//     }
// }


class AIService
{
    public function ask(string $prompt): string
    {
        $apiKey = config('services.gemini.api_key');
        $model = config('services.gemini.chat_model');

        if (!$apiKey) {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        $response = Http::timeout(60)
            ->withHeaders([
                'x-goog-api-key' => $apiKey,
                'Content-Type' => 'application/json',
            ])
            ->post(
                "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent",
                [
                    'contents' => [
                        [
                            'parts' => [
                                [
                                    'text' => $prompt,
                                ],
                            ],
                        ],
                    ],
                ]
            )
            ->throw();

        $text = $response->json(
            'candidates.0.content.parts.0.text'
        );

        if (!is_string($text) || trim($text) === '') {
            throw new RuntimeException(
                'Gemini returned an empty response.'
            );
        }

        return trim($text);
    }
}