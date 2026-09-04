<?php

$db = Database::getInstance()->getConnection();

$name = $input['name'] ?? null;
$description = $input['description'] ?? null;
$slug = $input['slug'] ?? null;
$user_id = $input['user_id'] ?? null;

// Validaciones
if (!$name || !$description || !$slug || !$user_id) {
    Response::error('Todos los campos son requeridos', 400);
}

$stmt = $db->prepare("INSERT INTO businesses (name, description, slug, user_id) VALUES (?, ?, ?, ?)");
$stmt->execute([$name, $description, $slug, $user_id]);

Response::success('Negocio creado exitosamente');