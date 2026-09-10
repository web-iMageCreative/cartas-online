<?php

$db = Database::getInstance()->getConnection();
$business_slug = $input['business_slug'] ?? null;

if (!$business_slug) {
    Response::error('El slug del negocio es requerido', 400);
}

$stmt = $db->prepare("SELECT id FROM businesses WHERE slug = ?");
$stmt->execute([trim($business_slug)]);
$business = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$business) {
    Response::error('No se encuentra el negocio: ' . $business_slug, 404);
}

$business_id = $business['id'];

// 4. Obtener los menús vinculados
$stmt = $db->prepare("SELECT * FROM menus WHERE business_id = ?");
$stmt->execute([trim($business_id)]);
$menus = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Devuelve los menús (incluso si el arreglo está vacío [])
Response::success($menus, 'Menús obtenidos correctamente');