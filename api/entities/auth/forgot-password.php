<?php
require_once __DIR__ . '/../../includes/Mailer.php';

$db = Database::getInstance()->getConnection();
$mailer = new Mailer();
$token = bin2hex(random_bytes(16));
$email = $input['email'] ?? null;

if (!$email) {
    Response::error('Email es requerido', 400);
}

$stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
$user_id = $user['id'] ?? null;

if (!$user) {
    Response::error('Email no encontrado', 404);
}

$stmt = $db->prepare("UPDATE users SET recovery = ?, updated_at = NOW() WHERE id = ?");
$stmt->execute([$token, $user_id]);

$res = $mailer->send(
    $email,
    'Cliente',
    'Solicitud de restablecimiento de contraseña - Cartas Online',
    "Estimado cliente.\n\nHas solicitado un cambio de contraseña de acceso a Cartas Online.\n\n
    Por favor, haz clic en el siguiente enlace para restablecer tu contraseña:\n\n
    https://dev3.icreative.es/reset-password/{$token}\n\n
    Este enlace expirará en 1 hora."
);

if (!$res) {
    Response::error('Error al enviar el correo electrónico', 500);
}

Response::success('Link para restablecer contraseña ha sido enviado a su correo electrónico.');