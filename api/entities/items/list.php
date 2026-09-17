<?php

$input = json_decode(file_get_contents('php://input'), true) ?? $input ?? [];
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

// Permite ítems con is_active = 1 o que no tengan asignado el campo todavía
$conditions[] = '(is_active = 1 OR is_active IS NULL)';
$whereClause = implode(' AND ', $conditions);

$sql = "SELECT * FROM items WHERE {$whereClause} ORDER BY display_order ASC, id ASC";
$stmt = $db->prepare($sql);
$stmt->execute($queryParams);
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($items as &$item) {
    $stmtAllergens = $db->prepare('SELECT allergen_id FROM allergens_items WHERE item_id = ?');
    $stmtAllergens->execute([$item['id']]);
    $item['allergens'] = $stmtAllergens->fetchAll(PDO::FETCH_COLUMN);
}
unset($item);

Response::success($items, 'Lista de platos obtenida correctamente');