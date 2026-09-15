<?php

$db = Database::getInstance()->getConnection();

$input = $_POST;

$id             = $input['id'] ?? null;
$name           = $input['name'] ?? null;
$description    = $input['description'] ?? null;
$price          = $input['price'] ?? null;
$category_id    = $input['category_id'] ?? null;
$delete_image   = (bool) ($input['deleteImage'] ?? false);
$has_image      = isset($_FILES['image']);
$remove_image   = !$has_image && $delete_image;

$allergens      = isset($input['allergens']) ? json_decode($input['allergens'], true) : null;

if (!$id || !$name || !$price) {
    Response::error('ID, nombre y precio son obligatorios', 400);
}

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

    $fields = [
        'name = ?',
        'description = ?',
        'price = ?',
        'category_id = ?',
        'subcategory_id = ?',
        'display_order = ?',
        'is_available = ?',
        'is_active = ?',
        'updated_at = NOW()'
    ];

    $params = [
        $name,
        $description,
        $price,
        $category_id,
        $subcategory_id,
        $display_order,
        $is_available,
        $is_active
    ];

    if ($has_image) {
        $fields[] = 'image = ?';
        $params[] = $image_path;
    } elseif ($remove_image) {
        $fields[] = 'image = ?';
        $params[] = null;
    }

    $params[] = $id;

    $sql = "UPDATE items SET " . implode(", ", $fields) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    // Actualización de alérgenos (Elimina existentes y vuelve a insertar)
    if (is_array($allergens)) {
        $deleteStmt = $db->prepare("DELETE FROM allergens_items WHERE item_id = ?");
        $deleteStmt->execute([$id]);

        if (!empty($allergens)) {
            $insertStmt = $db->prepare("INSERT INTO allergens_items (allergen_id, item_id) VALUES (?, ?)");
            foreach ($allergens as $allergen_id) {
                $insertStmt->execute([$allergen_id, $id]);
            }
        }
    }

    $db->commit();
    Response::success('Plato actualizado exitosamente');

} catch (Exception $e) {
    $db->rollBack();
    Response::error('Error al actualizar el plato: ' . $e->getMessage(), 500);
}