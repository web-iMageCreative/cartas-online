<?php

// Asegura la lectura del JSON recibido
$input = json_decode(file_get_contents('php://input'), true) ?? $input ?? [];

$db = Database::getInstance()->getConnection();

$id = $input['id'] ?? null;

if ($id) {
    // Consulta para obtener una categoría específica por ID
    $stmt = $db->prepare('SELECT * FROM categories WHERE menu_id = ?');
    $stmt->execute([$id]);
    $category = $stmt->fetchAll(PDO::FETCH_ASSOC);

    Response::success($category, 'Categoría obtenida correctamente');
}