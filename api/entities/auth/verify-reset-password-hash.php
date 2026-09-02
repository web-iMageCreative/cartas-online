<?php
require_once __DIR__ . '/../../includes/Mailer.php';

$db = Database::getInstance()->getConnection();
$hash = $input['hash'] ?? null;

if (!$hash) {
    Response::error('Identificador es requerido', 400);
}

$stmt = $db->prepare("SELECT id, email FROM users WHERE recovery = ?");
$stmt->execute([$hash]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    Response::error('Usuario no encontrado no encontrado', 404);
}

Response::success('Identificador de recuperación válido.');