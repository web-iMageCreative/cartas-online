<?php

$db = Database::getInstance()->getConnection();
$user_id = $input['user_id'] ?? null;

// 2. Validación de entrada
if (!$user_id) {
    Response::error('El ID del usuario es requerido', 400);
}

// 3. Buscar el negocio por su ID
$stmt = $db->prepare("SELECT * FROM businesses WHERE user_id = ? AND is_active = 1");
$stmt->execute([trim($user_id)]);
$business = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$business) {
    Response::error('No se encuentran negocios para el usuario: ' . $user_id, 404);
}

// Devuelve los negocios (incluso si el arreglo está vacío [])
Response::success($business, 'Negocios obtenidos correctamente');