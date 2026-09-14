<?php

$db = Database::getInstance()->getConnection();

$id      = $input['id'] ?? $params['id'] ?? null;
$menu_id = $input['menu_id'] ?? null;

if ($id) {
    $stmt = $db->prepare('SELECT * FROM categories WHERE id = ?');
    $stmt->execute([$id]);
    $category = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$category) {
        Response::error('Categoría no encontrada', 404);
    }

    Response::success($category, 'Categoría obtenida correctamente');
} elseif ($menu_id) {
    $stmt = $db->prepare('SELECT * FROM categories WHERE menu_id = ?');
    $stmt->execute([$menu_id]);
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    Response::success($categories, 'Categorías obtenidas correctamente');
} else {
    Response::error('El ID de categoría o de menú es obligatorio', 400);
}