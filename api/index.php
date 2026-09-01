<?php

require_once __DIR__ . '/includes/helpers.php';
require_once __DIR__ . '/includes/Database.php';
require_once __DIR__ . '/includes/Response.php';
require_once __DIR__ . '/includes/Auth.php';
require_once __DIR__ . '/includes/Validator.php';

// Cargar variables de entorno
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

// Configurar CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, X-Requested-With');
header('Access-Control-Expose-Headers: X-Auth-Token'); // Para exponer el header
header('Content-Type: application/json');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Obtener la ruta solicitada
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$path = str_replace('/api', '', $path);
$path = trim($path, '/');

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Obtener datos del body
$input = json_decode(file_get_contents('php://input'), true) ?? [];

// Obtener parámetros de URL
$params = $_GET;

// Router
try {
    $segments = explode('/', $path);
    $entity = $segments[0] ?? '';
    $action = $segments[1] ?? '';
    $id = $segments[2] ?? null;
    
    // Si hay ID, pasar como parámetro
    if ($id && is_numeric($id)) {
        $params['id'] = $id;
    }
    
    // Construir ruta al archivo
    $filePath = __DIR__ . '/entities/' . $entity . '/' . $action . '.php';
    
    if (file_exists($filePath)) {
        require_once $filePath;
    } else {
        Response::error('Endpoint no encontrado: ' . $filePath, 404);
    }
    
} catch (Exception $e) {
    Response::error($e->getMessage(), 500);
}