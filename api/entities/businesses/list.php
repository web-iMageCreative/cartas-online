<?php

$db = Database::getInstance()->getConnection();

// 1. Capturar los datos recibidos (Soporta JSON, $_POST y $_GET)
$input = json_decode(file_get_contents('php://input'), true);
$user_id = $input['user_id'] ?? null;

// 2. Validación de entrada
if (!$user_id) {
    Response::error('El ID del usuario es requerido', 400);
}

// 3. Buscar el negocio por su ID
$stmt = $db->prepare("SELECT * FROM businesses WHERE user_id = ?");
$stmt->execute([trim($user_id)]);
$business = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$business) {
    Response::error('No se encuentran negocios para el usuario: ' . $user_id, 404);
}

// Devuelve los negocios (incluso si el arreglo está vacío [])
Response::success($business, 'Negocios obtenidos correctamente');