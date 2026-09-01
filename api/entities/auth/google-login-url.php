<?php
// entities/auth/google-login-url.php

$googleClientId = $_ENV['GOOGLE_CLIENT_ID'] ?? '';
$redirectUri = $_ENV['GOOGLE_REDIRECT_URI'] ?? 'https://tudominio.com/api/auth/google-callback.php';

$authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query([
    'client_id' => $googleClientId,
    'redirect_uri' => $redirectUri,
    'response_type' => 'code',
    'scope' => 'email profile',
    'access_type' => 'online',
    'prompt' => 'select_account',
]);

Response::success(['url' => $authUrl]);