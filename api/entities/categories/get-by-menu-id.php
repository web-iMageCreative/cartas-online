<?php

// Asegura la lectura del JSON recibido
$input = json_decode(file_get_contents('php://input'), true) ?? $input ?? [];

$db = Database::getInstance()->getConnection();

$id = $input['id'] ?? null;

if ($id) {
    // Consulta para obtener una categoría específica por ID
    $stmt = $db->prepare('SELECT * FROM categories WHERE menu_id = ? ORDER BY display_order ASC');
    $stmt->execute([$id]);
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $ordered_categories = [];

    foreach ($categories as $category) {
        if ( ! $category['parent'] ) {
            $childs = [];

            foreach($categories as $child) {
                if ($child['parent'] == $category['id']) {
                    $childs[] = $child;
                }
            }

            $category['subcategories'] = $childs;
            $ordered_categories[] = $category;
        }
    }

    Response::success($ordered_categories, 'Categoría obtenida correctamente');
}