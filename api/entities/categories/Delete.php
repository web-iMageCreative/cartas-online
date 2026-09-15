<?php

$db = Database::getInstance()->getConnection();

$id = $input['id'] ?? $params['id'] ?? null;

if (!$id) {
    Response::error('El ID de la categoría es obligatorio', 400);
}

$stmt = $db->prepare('DELETE FROM categories WHERE id = ?');
$executed = $stmt->execute([$id]);

if ($executed && $stmt->rowCount() > 0) {
    Response::success([], 'Categoría eliminada exitosamente');
} else {
    Response::error('No se pudo eliminar la categoría o no existe', 404);
}