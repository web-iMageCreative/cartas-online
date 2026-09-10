<?php

$db = Database::getInstance()->getConnection();

$id = $input['id'] ?? null;

if (!$id) {
    Response::error('El ID del menú es obligatorio', 400);
}

$stmt = $db->prepare('SELECT * FROM menus WHERE id = ? LIMIT 1');
$stmt->execute([$id]);
$menu = $stmt->fetch();

if (!$menu) {
    Response::error('Menú no encontrado', 404);
}

Response::success([$menu], 'Menú obtenido correctamente');