<?php
require_once __DIR__ . '/../../includes/Mailer.php';

$db = Database::getInstance()->getConnection();
$mailer = new Mailer();
$hash = $input['hash'] ?? null;
$new_password = $input['password'] ?? null;
$new_password_hash = password_hash($new_password, PASSWORD_DEFAULT);

if (!$hash || !$new_password) {
    Response::error('Identificador y contraseña son requeridos', 400);
}

$stmt = $db->prepare("SELECT id, email FROM users WHERE recovery = ?");
$stmt->execute([$hash]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
$user_id = $user['id'] ?? null;
$email = $user['email'] ?? null;

if (!$user) {
    Response::error('Usuario no encontrado no encontrado', 404);
}

$stmt = $db->prepare("UPDATE users SET recovery = NULL, password = ?, updated_at = NOW() WHERE id = ?");
$stmt->execute([$new_password_hash, $user_id]);

$res = $mailer->send(
    $email,
    'Cliente',
    'Contraseña cambiada - Cartas Online',
    "Estimado cliente.\n\nHas efectuado el cambio de contraseña correctamente.\n\ngracias por utilizar nuestro servicio.\n\nSaludos cordiales,\nEl equipo de Cartas Online."
);

if (!$res) {
    Response::error('Error al enviar el correo electrónico', 500);
}

Response::success('Contraseña cambiada correctamente.');