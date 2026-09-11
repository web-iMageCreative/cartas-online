<?php

$db = Database::getInstance()->getConnection();

$name        = $input['name'] ?? null;
$description = $input['description'] ?? null;
$parent      = $input['parent'] ?? null;
$menu_id     = $input['menu_id'] ?? null;

// Validación
if (!$name) {
    Response::error('El nombre es obligatorio', 400);
}

// Inserción en la BD
$sql = "INSERT INTO categories (name, description, menu_id, parent) 
        VALUES (?, ?, ?, ?)";

$stmt = $db->prepare($sql);
$executed = $stmt->execute([
    $name,
    $description,
    $menu_id,
    $parent
]);

if ($executed) {
    Response::success('Categoría creada exitosamente');
} else {
    Response::error('Error al guardar en la base de datos', 500);
}