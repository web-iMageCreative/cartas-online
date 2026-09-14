<?php

$db = Database::getInstance()->getConnection();

$id = $input['id'] ?? $params['id'] ?? null;

if (!$id) {
    Response::error('El ID del negocio es obligatorio', 400);
}

$stmt = $db->prepare('DELETE FROM businesses WHERE id = ?');
$executed = $stmt->execute([$id]);

if ($executed && $stmt->rowCount() > 0) {
    Response::success([], 'Negocio eliminado exitosamente');
} else {
    Response::error('No se pudo eliminar el negocio o no existe', 404);
}