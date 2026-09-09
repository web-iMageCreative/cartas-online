<?php

$db = Database::getInstance()->getConnection();

// Datos enviados mediante FormData
$input = $_POST;

$name        = $input['name'] ?? null;
$slug        = $input['slug'] ?? null;
$description = $input['description'] ?? null;
$address     = $input['address'] ?? null;
$email       = $input['email'] ?? null;
$phone       = $input['phone'] ?? null;
$user_id     = $input['user_id'] ?? null;
$is_active   = $input['is_active'] ?? 1;

// Función para guardar archivos en la carpeta public/user_img
function saveUploadedFile($fileKey) {
    if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $file = $_FILES[$fileKey];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'webp', 'svg'];

    if (!in_array($ext, $allowed)) {
        return null;
    }

  // Subir 3 niveles (businesses -> entities -> api -> CARTAS-ONLINE)
    $uploadPath = dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'user_img' . DIRECTORY_SEPARATOR;

    if (!is_dir($uploadPath)) {
        mkdir($uploadPath, 0755, true);
    }

    $fileName = uniqid('img_', true) . '.' . $ext;
    $destination = $uploadPath . $fileName;

    if (move_uploaded_file($file['tmp_name'], $destination)) {
        return '/public/user_img/' . $fileName;
    }

    return null;
}

// Procesar imágenes
$logo_path        = saveUploadedFile('logo');
$cover_image_path = saveUploadedFile('cover_image');

// Validación
if (!$name) {
    Response::error('El nombre es obligatorio', 400);
}

// Inserción en la BD
$sql = "INSERT INTO businesses (name, slug, description, address, email, phone, user_id, logo, cover_image, is_active) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $db->prepare($sql);
$executed = $stmt->execute([
    $name,
    $slug,
    $description,
    $address,
    $email,
    $phone,
    $user_id,
    $logo_path,
    $cover_image_path,
    $is_active
]);

if ($executed) {
    Response::success('Negocio creado exitosamente');
} else {
    Response::error('Error al guardar en la base de datos', 500);
}