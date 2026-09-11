<?php

$db = Database::getInstance()->getConnection();

$slug = $input['slug'] ?? null;

if (!$slug) {
    Response::error('El Slug del menú es obligatorio', 400);
}

$stmt = $db->prepare('SELECT * FROM menus WHERE slug = ? LIMIT 1');
$stmt->execute([$slug]);
$menu = $stmt->fetch();

if (!$menu) {
    Response::error('Menú no encontrado', 404);
}

Response::success([$menu], 'Menú obtenido correctamente');