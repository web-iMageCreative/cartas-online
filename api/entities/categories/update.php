<?php

$db = Database::getInstance()->getConnection();

$id =          $input['id'] ?? null;
$name =        $input['name'] ?? null;
$description = $input['description'] ?? null;
$menu_id =     $input['menu_id'] ?? null;
$parent =   $input['parent'] ?? null;

$stmt = $db->prepare('UPDATE categories SET name = ?, description = ?, menu_id = ?, parent = ?, updated_at = NOW() WHERE id = ?');
$category = $stmt->execute([
    $name,
    $description,
    $menu_id,
    $parent,
    $id,
]);

if (!$category) {
    Response::error('Ha sido imposible editar la categoría', 404);
}

Response::success($category, 'Categoría editada correctamente');