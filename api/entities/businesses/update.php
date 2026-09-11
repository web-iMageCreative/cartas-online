<?php

$db = Database::getInstance()->getConnection();

// Datos enviados mediante FormData
$input = $_POST;

$id           = $input['id'] ?? null;
$name         = $input['name'] ?? null;
$slug         = $input['slug'] ?? null;
$description  = $input['description'] ?? null;
$address      = $input['address'] ?? null;
$email        = $input['email'] ?? null;
$phone        = $input['phone'] ?? null;
$user_id      = $input['user_id'] ?? null;
$is_active    = $input['is_active'] ?? 1;

$delete_logo  = (bool) $input['deleteLogo'] ?? null;
$delete_cover = (bool) $input['deleteCover'] ?? null;
$has_logo     = isset($_FILES['logo']);
$has_cover    = isset($_FILES['cover_image']);
$remove_logo  = !$has_logo && $delete_logo;
$remove_cover = !$has_cover && $delete_cover;

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
    Response::error('El nombre es obligatorio', 401);
}

$fields = [
    'name = ?', 
    'description = ?', 
    'address = ?', 
    'email = ?', 
    'phone = ?', 
    'updated_at = NOW()'
];

$params = [
    $name,
    $description,
    $address,
    $email,
    $phone
];

if ($has_logo) {
    $fields[] = 'logo = ?';
    $params[] = $logo_path;
}

if ($has_cover) {
    $fields[] = 'cover_image = ?';
    $params[] = $cover_image_path;
}

if ($remove_logo) {
    $fields[] = 'logo = ?';
    $params[] = null;
}

if ($remove_cover) {
    $fields[] = 'cover_image = ?';
    $params[] = null;
}

$params[] = $id;

// Inserción en la BD
$sql = "UPDATE businesses SET " . implode(", ", $fields) . " WHERE id = ?";
$stmt = $db->prepare($sql);
$executed = $stmt->execute($params);

if ($executed) {
    Response::success('Negocio editado exitosamente');
} else {
    Response::error('Error al editar en la base de datos', 500);
}