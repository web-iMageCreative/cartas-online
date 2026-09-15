<?php

$db = Database::getInstance()->getConnection();

$id = $input['id'] ?? $params['id'] ?? null;

if (!$id) {
    Response::error('El ID del plato es obligatorio', 400);
}

try {
    $db->beginTransaction();

    // Eliminar relaciones de alérgenos asociadas
    $stmtAllergens = $db->prepare('DELETE FROM allergens_items WHERE item_id = ?');
    $stmtAllergens->execute([$id]);

    // Eliminar el plato
    $stmt = $db->prepare('DELETE FROM items WHERE id = ?');
    $executed = $stmt->execute([$id]);

    if ($executed && $stmt->rowCount() > 0) {
        $db->commit();
        Response::success([], 'Plato eliminado exitosamente');
    } else {
        $db->rollBack();
        Response::error('No se pudo eliminar el plato o no existe', 404);
    }
} catch (Exception $e) {
    $db->rollBack();
    Response::error('Error al eliminar el plato: ' . $e->getMessage(), 500);
}