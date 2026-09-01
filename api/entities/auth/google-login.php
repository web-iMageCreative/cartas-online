<?php
// entities/auth/google-login.php

// Configuración de Google OAuth
$googleClientId = $_ENV['GOOGLE_CLIENT_ID'] ?? '';
$googleClientSecret = $_ENV['GOOGLE_CLIENT_SECRET'] ?? '';
$redirectUri = $_ENV['GOOGLE_REDIRECT_URI'] ?? 'https://tudominio.com/api/auth/google-callback.php';

if (empty($googleClientId) || empty($googleClientSecret)) {
    Response::error('Configuración de Google OAuth incompleta', 500);
}

// Generar URL de autorización
$authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query([
    'client_id' => $googleClientId,
    'redirect_uri' => $redirectUri,
    'response_type' => 'code',
    'scope' => 'email profile',
    'access_type' => 'online',
    'prompt' => 'select_account',
]);

// Redirigir al usuario a Google
header('Location: ' . $authUrl);
exit;