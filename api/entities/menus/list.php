<?php

$db = Database::getInstance()->getConnection();

$business_slug = $input['business_slug'] ?? null;

// Validaciones
if (!$business_slug) {
  Response::error('negocio no encontrado', 400);
}

// Obtenemos el ID del negocio a partir del slug
$stmt = $db->prepare("SELECT id FROM businesses WHERE slug = ?");
$stmt->execute([$business_slug]);

if ($menus = $stmt->fetch()) {
  $business_id = $menus['id'];
} else {
  Response::error('No encuentra negocio' . $business_slug, 501);
}

$stmt = $db->prepare("SELECT * FROM menus WHERE business_id = ?");
$stmt->execute([$business_id]);

if ($menus = $stmt->fetchAll()) {
  Response::success($menus, 'Menús obtenidos correctamente');
} else {
  Response::error('No encuentra negocio' . $business_slug, 501);
}
