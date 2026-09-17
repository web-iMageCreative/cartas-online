<?php

$db = Database::getInstance()->getConnection();

$menu_id        = $input['menu_id'] ?? null;
$category_id    = $input['category_id'] ?? null;
$subcategory_id = $input['subcategory_id'] ?? null;

if (!$menu_id && !$category_id && !$subcategory_id) {
    Response::error('Se requiere menu_id, category_id o subcategory_id', 400);
}

$conditions = [];
$queryParams = [];

if ($menu_id) {
    $conditions[] = 'menu_id = ?';
    $queryParams[] = $menu_id;
}
if ($category_id) {
    $conditions[] = 'category_id = ?';
    $queryParams[] = $category_id;
}
if ($subcategory_id) {
    $conditions[] = 'subcategory_id = ?';
    $queryParams[] = $subcategory_id;
}

$conditions[] = 'is_active = 1';
$whereClause = implode(' AND ', $conditions);

$sql = "SELECT * FROM items WHERE {$whereClause} ORDER BY display_order ASC, id ASC";
$stmt = $db->prepare($sql);
$stmt->execute($queryParams);
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Adjuntar el listado de IDs de alérgenos a cada plato devuelto
foreach ($items as $item) {
    $stmtAllergens = $db->prepare('SELECT allergen_id FROM allergens_items WHERE item_id = ?');
    $stmtAllergens->execute([$item['id']]);
    $item['allergens'] = $stmtAllergens->fetchAll(PDO::FETCH_COLUMN);
}

Response::success($items, 'Lista de platos obtenida correctamente');