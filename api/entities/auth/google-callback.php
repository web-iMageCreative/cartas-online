<?php
// entities/auth/google-callback.php

$code = $_GET['code'] ?? null;

if (!$code) {
    Response::error('Código de autorización no proporcionado', 400);
}

$googleClientId = $_ENV['GOOGLE_CLIENT_ID'] ?? '';
$googleClientSecret = $_ENV['GOOGLE_CLIENT_SECRET'] ?? '';
$redirectUri = $_ENV['GOOGLE_REDIRECT_URI'] ?? 'https://tudominio.com/api/auth/google-callback.php';

// Intercambiar código por token
$tokenUrl = 'https://oauth2.googleapis.com/token';

$postData = http_build_query([
    'code' => $code,
    'client_id' => $googleClientId,
    'client_secret' => $googleClientSecret,
    'redirect_uri' => $redirectUri,
    'grant_type' => 'authorization_code',
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $tokenUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded',
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    Response::error('Error al obtener token de Google: ' . $response, 500);
}

$tokenData = json_decode($response, true);
$accessToken = $tokenData['access_token'] ?? null;

if (!$accessToken) {
    Response::error('No se pudo obtener token de acceso', 500);
}

// Obtener datos del usuario
$userInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $userInfoUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $accessToken,
]);

$userInfo = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    Response::error('Error al obtener información del usuario: ' . $userInfo, 500);
}

$googleUser = json_decode($userInfo, true);

$email = $googleUser['email'] ?? null;
$name = $googleUser['name'] ?? null;
$googleId = $googleUser['sub'] ?? null;
$picture = $googleUser['picture'] ?? null;

if (!$email || !$googleId) {
    Response::error('No se pudieron obtener datos del usuario de Google', 400);
}

$db = Database::getInstance()->getConnection();

// Buscar o crear usuario
$stmt = $db->prepare("
    SELECT id, name, email, auth_provider, google_id 
    FROM users 
    WHERE email = ? OR google_id = ?
");
$stmt->execute([$email, $googleId]);
$user = $stmt->fetch();

if ($user) {
    // Usuario existe, actualizar si es necesario
    $userId = $user['id'];
    
    if ($user['google_id'] !== $googleId) {
        $stmt = $db->prepare("UPDATE users SET google_id = ?, auth_provider = 'google' WHERE id = ?");
        $stmt->execute([$googleId, $userId]);
    }
    
    if ($user['name'] !== $name) {
        $stmt = $db->prepare("UPDATE users SET name = ? WHERE id = ?");
        $stmt->execute([$name, $userId]);
    }
    
    if ($picture && $user['profile_picture'] !== $picture) {
        $stmt = $db->prepare("UPDATE users SET profile_picture = ? WHERE id = ?");
        $stmt->execute([$picture, $userId]);
    }
    
} else {
    // Crear nuevo usuario
    $stmt = $db->prepare("
        INSERT INTO users (name, email, google_id, auth_provider, profile_picture) 
        VALUES (?, ?, ?, 'google', ?)
    ");
    $stmt->execute([$name, $email, $googleId, $picture]);
    $userId = $db->lastInsertId();
}

// Generar JWT
$token = Auth::generateToken($userId, $email);

// Obtener datos actualizados
$stmt = $db->prepare("SELECT id, name, email, auth_provider, profile_picture FROM users WHERE id = ?");
$stmt->execute([$userId]);
$userData = $stmt->fetch();

// Redirigir al frontend con el token en la URL o establecer header
$frontendUrl = $_ENV['FRONTEND_URL'] ?? 'https://tudominio.com';

// Opción 1: Redirigir con token en URL (menos seguro pero común)
header('Location: ' . $frontendUrl . '?token=' . $token);

// Opción 2: Redirigir con header (necesita que el frontend pueda leer el header)
// header('X-Auth-Token: ' . $token);
// header('Location: ' . $frontendUrl . '/auth/success');
// exit;

// Opción 3: Mostrar JSON con el token para que el frontend lo maneje
// Response::auth($token, $userData, 'Login con Google exitoso');