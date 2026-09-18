<?php

$db = Database::getInstance()->getConnection();

$menu_id   = $input['id'] ?? $params['id'] ?? null;
$name      = $input['name'] ?? $params['name'] ?? null;
$description = $input['description'] ?? $params['description'] ?? null;
$business_id = $input['business_id'] ?? $params['business_id'] ?? null;



$stmt = $db->prepare('UPDATE menus SET name = ?, description = ?, business_id = ? WHERE id = ?');
$updated = $stmt->execute([$name, $description, $business_id, $menu_id]);

if ($updated) {
    Response::success(null, 'Menú actualizado correctamente');
} else {
    Response::error('El nombre o la descripción del menú es obligatorio', 400);
}