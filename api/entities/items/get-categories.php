<?php

$db = Database::getInstance()->getConnection();

$menu_slug = $input['menu_slug'] ?? null;

if ($menu_slug) {
    $stmt = $db->prepare('SELECT * FROM menus WHERE slug = ?');
    $stmt->execute([$menu_slug]);
    $menu = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$menu) {
        Response::error('Menu no encontrado', 404);
        return;
    }

    // Consulta para obtener una categoría específica por ID
    $stmt = $db->prepare('SELECT * FROM categories WHERE menu_id = ?');
    $stmt->execute([$menu['id']]);
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    Response::success($categories, 'Categorías obtenidas correctamente');
}