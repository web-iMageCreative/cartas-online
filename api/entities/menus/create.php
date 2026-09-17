<?php

$db = Database::getInstance()->getConnection();

$name = $input['name'] ?? null;
$description = $input['description'] ?? null;
$slug = $input['slug'] ?? null;
$business_slug = $input['business_slug'] ?? null;

// Validaciones
if (!$name || !$description || !$slug || !$business_slug) {
    Response::error('Todos los campos son requeridos', 400);
}



// Obtenemos el ID del negocio a partir del slug
$stmt = $db->prepare("SELECT id FROM businesses WHERE slug = ?");
$stmt->execute([$business_slug]);

$business = $stmt->fetch();

if ($business) {
   $business_id = $business['id'];
} else {
    Response::error('No encuentra negocio: ' . $business_slug, 400);
}

function ensureUniqueSlug($db, $slug, $business_id) {
    if (!$slug) {
        return $slug;
    }

    $candidate = $slug;
    $stmt = $db->prepare("SELECT 1 FROM menus WHERE slug = ? AND business_id = ? LIMIT 1");

    while (true) {
        $stmt->execute([$candidate, $business_id]);
        $exists = $stmt->fetchColumn();

        if ($exists === false) {
            return $candidate;
        }

        if (preg_match('/^(.*)-(\d+)$/', $candidate, $m)) {
            $base = $m[1];
            $num = intval($m[2]) + 1;
            $candidate = $base . '-' . $num;
        } else {
            $candidate = $candidate . '-2';
        }
    }
}

$slug = ensureUniqueSlug($db, $slug, $business_id);

$stmt = $db->prepare("INSERT INTO menus (name, description, slug, business_id) VALUES (?, ?, ?, ?)");
$insert= $stmt->execute([$name, $description, $slug, $business_id]);
if(!$insert){
    Response::error('error al crear menu: '. $stmt->errorInfo()[2], 501);
}

Response::success('Menú creado exitosamente');