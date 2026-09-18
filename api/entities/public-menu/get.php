<?php

$db = Database::getInstance()->getConnection();

$id = $input['id'] ?? $params['id'] ?? null;

if (!$id) {
    Response::error('El ID del plato es obligatorio', 400);
}

$stmt = $db->prepare('SELECT * FROM items WHERE menu_id = ?');
$stmt->execute([$id]);
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$items) {
    Response::error('Plato no encontrado', 404);
}

$items_id = [];
foreach($items as $item) {
    $items_id[] = $item['id'];
}

// Obtener los IDs de alérgenos asociados para cargar en el formulario de edición
$stmtAllergens = $db->prepare(
    'SELECT * FROM allergens_items ai JOIN allergens a ON ai.allergen_id = a.id WHERE item_id IN (' . implode(',', $items_id) . ')'
);
$stmtAllergens->execute();
$allergens= $stmtAllergens->fetchAll(PDO::FETCH_ASSOC);

foreach ($items as &$item) {
    $item['allergens'] = [];
    foreach ($allergens as $allergen) {
        if ($allergen['item_id'] == $item['id']) {
            $item['allergens'][] = $allergen;
        }
    }
}

Response::success($items, 'Platos obtenidos correctamente');