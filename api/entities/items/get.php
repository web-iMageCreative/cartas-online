<?php

$db = Database::getInstance()->getConnection();

$id = $input['id'] ?? $params['id'] ?? null;

if (!$id) {
    Response::error('El ID del plato es obligatorio', 400);
}

$stmt = $db->prepare('SELECT * FROM items WHERE id = ? LIMIT 1');
$stmt->execute([$id]);
$item = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$item) {
    Response::error('Plato no encontrado', 404);
}

// Obtener los IDs de alérgenos asociados para cargar en el formulario de edición
$stmtAllergens = $db->prepare('SELECT allergen_id FROM allergens_items WHERE item_id = ?');
$stmtAllergens->execute([$id]);
$item['allergens'] = $stmtAllergens->fetchAll(PDO::FETCH_COLUMN);

Response::success($item, 'Plato obtenido correctamente');