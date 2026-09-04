<?php

$db = Database::getInstance()->getConnection();

$name = $input['name'] ?? null;
$slug = $input['slug'] ?? null;
$description = $input['description'] ?? null;
$address = $input['address'] ?? null;
$email = $input['email'] ?? null;
$phone = $input['phone'] ?? null;
$user_id = $input['user_id'] ?? null;
// $cover_image = $input['cover_image'] ?? null;
// $logo = $input['logo'] ?? null;
// $is_active = $input['is_active'] ?? null;

// Validaciones
// if ( !$name || !$slug || !$description || !$address || !$email || !$phone ) {
//     Response::error('Todos los campos son requeridos', 400);
// }

$stmt = $db->prepare("INSERT INTO businesses (name, slug, description, address, email, phone, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->execute([$name, $slug, $description, $address, $email, $phone, $user_id]);

Response::success('Negocio creado exitosamente');