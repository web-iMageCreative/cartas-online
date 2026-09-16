<?php

$db = Database::getInstance()->getConnection();

$stmt = $db->prepare('SELECT * FROM allergens');
$stmt->execute();
$allergens = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$allergens) {
    Response::error('no se encuentran alérgenos', 404);
}

Response::success($allergens, 'alergenos cargados');