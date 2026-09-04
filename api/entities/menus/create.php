<?php

$db = Database::getInstance()->getConnection();

$name = $input['name'] ?? null;
$description = $input['description'] ?? null;
$slug = $input['slug'] ?? null;
$business_slug = $input['business_slug'] ?? null;

// Validaciones
if (!$name || !$description || !$slug || !$business_slug) {
    Response::error('Todos los campos son requeridos', 400);
}

// Obtenemos el ID del negocio a partir del slug
$stmt = $db->prepare("SELECT id FROM businesses WHERE slug = ?");
$stmt->execute([$business_slug]);
if ($business = $stmt->fetch()) {
   $business_id = $business['id'];
}

$stmt = $db->prepare("INSERT INTO menus (name, description, slug, business_id) VALUES (?, ?, ?, ?)");
$stmt->execute([$name, $description, $slug, $business_id]);

Response::success('Menú creado exitosamente');