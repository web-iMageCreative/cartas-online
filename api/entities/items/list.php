<?php

$db = Database::getInstance()->getConnection();

$menu_id = $input['menu_id'] ?? null;

if (!$menu_id) {
    Response::error('Se requiere menu_id, category_id o subcategory_id', 400);
}

$stmtCategories = $db->prepare('SELECT * FROM categories WHERE menu_id = ? ORDER BY display_order ASC');
$stmtCategories->execute([$menu_id]);
$categories = $stmtCategories->fetchAll(PDO::FETCH_ASSOC);

foreach ($categories as &$category) {
    $category['items'] = [];

    $sql = "SELECT * FROM items WHERE menu_id = ? AND category_id = ? ORDER BY display_order ASC";
    $stmtItems = $db->prepare($sql);
    $stmtItems->execute([$menu_id, $category['id']]);
    $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

    if (count($items) > 0) {
        foreach ($items as &$item) {
            $stmtAllergens = $db->prepare('SELECT * FROM allergens_items ai JOIN allergens a ON ai.allergen_id = a.id WHERE item_id = ?');
            $stmtAllergens->execute([ $item['id'] ]);
            $item['allergens'] = $stmtAllergens->fetchAll(PDO::FETCH_ASSOC);

            $stmtVariations = $db->prepare('SELECT * FROM items_variations WHERE item_id = ?');
            $stmtVariations->execute([ $item['id'] ]);
            $item['variations'] = $stmtVariations->fetchAll(PDO::FETCH_ASSOC);
        }

        $category['items'] = $items;
    }
}


$ordered_categories = [];

foreach ($categories as &$category) {
    if ( ! $category['parent'] ) {
        $childs = [];

        foreach($categories as $child) {
            if ($child['parent'] === $category['id']) {
                $childs[] = $child;
            }
        }

        $category['subcategories'] = $childs;
        $ordered_categories[] = $category;
    }
}

Response::success($ordered_categories, 'Lista de platos obtenida correctamente');