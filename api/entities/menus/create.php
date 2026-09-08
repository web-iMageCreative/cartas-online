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
} else {
    Response::error('No encuentra negocio: '.$business_slug, 501);
}

$stmt = $db->prepare("INSERT INTO menus (name, description, slug, business_id) VALUES (?, ?, ?, ?)");
$insert = $stmt->execute([$name, $description, $slug, $business_id]);

if(!$insert) {
    Response::error('error al crear menu: '.$stmt->errorInfo()[2], 501);
}

Response::success('Menú creado exitosamente');