<?php

$db = Database::getInstance()->getConnection();

$input = $_POST;

$name           = $input['name'] ?? null;
$description    = $input['description'] ?? null;
$price          = $input['price'] ?? null;
$menu_id        = $input['menu_id'] ?? null;
$category_id    = $input['category_id'] ?? null;
$variations     = isset($input['variations']) ? json_decode($input['variations'], true) : [];
$allergens      = isset($input['allergens']) ? json_decode($input['allergens'], true) : [];


if (!$name || !$menu_id) {
    Response::error('Nombre, precio y menú son obligatorios', 400);
}

// Función para guardar imagen
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

    $uploadPath = dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'user_img' . DIRECTORY_SEPARATOR;

    if (!is_dir($uploadPath)) {
        mkdir($uploadPath, 0755, true);
    }

    $fileName = uniqid('item_', true) . '.' . $ext;
    $destination = $uploadPath . $fileName;

    if (move_uploaded_file($file['tmp_name'], $destination)) {
        return '/public/user_img/' . $fileName;
    }

    return null;
}

$image_path = saveUploadedFile('image');

try {
    $db->beginTransaction();

    $sql = "INSERT INTO items (name, description, image, price, menu_id, category_id) 
            VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = $db->prepare($sql);
    
    $item = $stmt->execute([
        $name,
        $description,
        $image_path,
        $price,
        $menu_id,
        $category_id
    ]);

    if (!$item) {
        throw new Exception('Error al guardar el plato');
    }

    $id = $db->lastInsertId();

    if (!empty($allergens)) {
        $insert_allergens_stmt = $db->prepare("INSERT INTO allergens_items (allergen_id, item_id) VALUES (?, ?)");
        foreach ($allergens as $allergen_id) {
            $insert_allergens_stmt->execute([$allergen_id, $id]);
        }
    }
    
    if (!empty($variations)) {
        $insert_variations_stmt = $db->prepare("INSERT INTO items_variations (name, price, item_id) VALUES (?, ?, ?)");
        foreach ($variations as $variation) {
            $insert_variations_stmt->execute([$variation['name'], $variation['price'], $id]);
        }
    }

    $db->commit();
    Response::success('Plato creado exitosamente');

} catch (Exception $e) {
    $db->rollBack();
    Response::error('Error al guardar el plato: ' . $e->getMessage(), 500);
}