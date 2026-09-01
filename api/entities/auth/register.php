<?php
// entities/auth/register.php

$db = Database::getInstance()->getConnection();

$name = $input['name'] ?? null;
$email = $input['email'] ?? null;
$password = $input['password'] ?? null;

// Validaciones
if (!$name || !$email || !$password) {
    Response::error('Todos los campos son requeridos', 400);
}

if (!Validator::email($email)) {
    Response::error('Email inválido', 400);
}

if (!Validator::minLength($password, 8)) {
    Response::error('La contraseña debe tener al menos 8 caracteres', 400);
}

// Verificar si el email ya existe
$stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    Response::error('El email ya está registrado', 409);
}

// Crear usuario
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $db->prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
$stmt->execute([$name, $email, $passwordHash]);

$userId = $db->lastInsertId();

// Generar token
$token = Auth::generateToken($userId, $email);

$user = [
    'id' => $userId,
    'name' => $name,
    'email' => $email,
];

Response::auth($token, $user, 'Registro exitoso');