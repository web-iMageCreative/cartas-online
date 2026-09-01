<?php
// entities/auth/login.php

$db = Database::getInstance()->getConnection();

$email = $input['email'] ?? null;
$password = $input['password'] ?? null;

if (!$email || !$password) {
    Response::error('Email y contraseña son requeridos', 400);
}

$stmt = $db->prepare("SELECT id, fullname, email, password FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    Response::error('Credenciales inválidas', 401);
}

// Generar token
$token = Auth::generateToken($user['id'], $user['email']);

// Eliminar password_hash de la respuesta
unset($user['password_hash']);

// Enviar token en el header y en el body
header('X-Auth-Token: ' . $token);

Response::auth($token, $user);