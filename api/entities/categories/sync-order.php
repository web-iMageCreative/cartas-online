<?php

$db = Database::getInstance()->getConnection();

$id = $input['id'] ?? null;
$display_order = $input['display_order'] ?? null;

if ($id) {
  $stmt = $db->prepare('UPDATE categories SET display_order = ? WHERE id = ?');
  $stmt->execute([$display_order, $id]);

  Response::success('Orden de las Categorías sincronizadas con BD');
}