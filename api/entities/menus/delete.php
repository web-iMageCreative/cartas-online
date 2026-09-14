<?php

$db = Database::getInstance()->getConnection();



$menu_id = $input['id'] ?? null;

if (!$menu_id) {
    Response::error('ID del menú obligatorio', 400);
}

$stmt = $db->prepare("UPDATE menus SET is_active = 0, deleted_at = NOW() WHERE id = ?");
$stmt->execute([$menu_id]);

if ($stmt->rowCount() > 0) {
    Response::success('Menú eliminado correctamente');
} else {
    Response::error('No se encontró el menú', 404);
}