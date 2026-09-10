<?php

$db = Database::getInstance()->getConnection();

$slug = $input['slug'] ?? $input['business_slug'] ?? null;

if (!$slug) {
    Response::error('El slug del negocio es obligatorio', 400);
}

$stmt = $db->prepare('SELECT * FROM businesses WHERE slug = ? LIMIT 1');
$stmt->execute([$slug]);
$business = $stmt->fetch();

if (!$business) {
    Response::error('Negocio no encontrado', 404);
}

Response::success([$business], 'Nombre del negocio obtenido correctamente');