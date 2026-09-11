<?php

$db = Database::getInstance()->getConnection();

$menu_id = $input['menu_id'] ?? null;

if (!$menu_id) {
    Response::error('El ID del menú es obligatorio', 400);
}

$stmt = $db->prepare('SELECT * FROM categories WHERE menu_id = ? AND parent IS NULL');
$stmt->execute([$menu_id]);
$category = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$category) {
    Response::error('Categoría no encontrada', 404);
}

Response::success([$category], 'Categoría obtenida correctamente');