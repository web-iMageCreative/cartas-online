<?php

$db = Database::getInstance()->getConnection();

$menu_id = $input['menu_id'] ?? null;

if (!$menu_id) {
    Response::error('Se requiere menu_id, category_id o subcategory_id', 400);
}

$sql = "SELECT * FROM items WHERE menu_id = ? ORDER BY display_order ASC, id ASC";
$stmt = $db->prepare($sql);
$stmt->execute([$menu_id]);
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($items as &$item) {
    $stmtAllergens = $db->prepare('SELECT allergen_id FROM allergens_items WHERE item_id = ?');
    $stmtAllergens->execute([ $item['id'] ]);
    $item['allergens'] = $stmtAllergens->fetchAll(PDO::FETCH_COLUMN);
}

foreach ($items as &$item) {
    $stmtVariations = $db->prepare('SELECT * FROM item_variations WHERE item_id = ?');
    $stmtVariations->execute([ $item['id'] ]);
    $item['variations'] = $stmtVariations->fetchAll(PDO::FETCH_ASSOC);
}


Response::success($items, 'Lista de platos obtenida correctamente');