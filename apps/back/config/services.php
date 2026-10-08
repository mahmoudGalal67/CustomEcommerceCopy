<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'stripe' => [
        'secret' => env('STRIPE_SECRET'),
    ],
    'n8n' => [

        'order_created_webhook' => env(
            'N8N_ORDER_CREATED_WEBHOOK'
        ),
        'key' => env('N8N_AUTOMATION_KEY'),
    ],

    'gemini' => [
    'api_key' => env('GEMINI_API_KEY'),
    'chat_model' => env(
        'GEMINI_CHAT_MODEL',
        'gemini-2.5-flash-lite'
    ),
    'embedding_model' => env(
        'GEMINI_EMBEDDING_MODEL',
        'gemini-embedding-2'
    ),
    'embedding_dimensions' => (int) env(
        'GEMINI_EMBEDDING_DIMENSIONS',
        768
    ),
],

];
