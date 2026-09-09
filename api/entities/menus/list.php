<?php

$db = Database::getInstance()->getConnection();

// 1. Capturar los datos recibidos (Soporta JSON, $_POST y $_GET)
$input = json_decode(file_get_contents('php://input'), true);
$business_slug = $input['business_slug'] ?? $_POST['business_slug'] ?? $_GET['business_slug'] ?? null;

// 2. Validación de entrada
if (!$business_slug) {
    Response::error('El slug del negocio es requerido', 400);
}

// 3. Buscar el negocio por su slug
$stmt = $db->prepare("SELECT id FROM businesses WHERE slug = ?");
$stmt->execute([trim($business_slug)]);
$business = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$business) {
    Response::error('No se encuentra el negocio: ' . $business_slug, 404);
}

$business_id = $business['id'];

// 4. Obtener los menús vinculados
$stmt = $db->prepare("SELECT * FROM menus WHERE business_id = ?");
$stmt->execute([$business_id]);
$menus = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Devuelve los menús (incluso si el arreglo está vacío [])
Response::success($menus, 'Menús obtenidos correctamente');