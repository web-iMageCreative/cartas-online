<?php

// Asegura la lectura del JSON recibido
$input = json_decode(file_get_contents('php://input'), true) ?? $input ?? [];

$db = Database::getInstance()->getConnection();

$id      = $input['id'] ?? null;
$menu_id = $input['menu_id'] ?? null;

if ($id) {
    // Consulta para obtener una categoría específica por ID
    $stmt = $db->prepare('SELECT * FROM categories WHERE id = ?');
    $stmt->execute([$id]);
    $category = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$category) {
        Response::error('Categoría no encontrada', 404);
    }

    Response::success($category, 'Categoría obtenida correctamente');

}