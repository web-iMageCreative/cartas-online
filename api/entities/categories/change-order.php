<?php

// Asegura la lectura del JSON recibido

$db = Database::getInstance()->getConnection();

$direction = $input['direction'] ?? null;
$category_id = $input['category_id'] ?? null;

if ($direction && $category_id) {
    // Consulta para obtener una categoría específica por ID
    $stmt = $db->prepare('SELECT * FROM categories WHERE id = ?');
    $stmt->execute([$category_id]);
    $category_actual = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt = $db->prepare('SELECT * FROM categories WHERE parent = ? AND display_order > ?');
    $stmt->execute([$category_actual['parent'], $category_actual['display_order']]);
    $category_next = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($category_next)) {
      $new_order = $category_actual['display_order'] + (int)$direction;
    } else {
      $new_order = $category_next['display_order'] + (int)$direction;
    }
      
    $stmt = $db->prepare('UPDATE categories SET display_order = ? WHERE id = ?');
    $stmt->execute([$new_order, $category_id]);

    Response::success(["newOrder" => $new_order]);
} else {
  Response::error('Se necesita dirección e id');
}