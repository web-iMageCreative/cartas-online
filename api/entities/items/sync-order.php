<?php

$db = Database::getInstance()->getConnection();

$id = $input['id'] ?? null;
$display_order = $input['display_order'] ?? null;

if ($id) {
  $stmt = $db->prepare('UPDATE items SET display_order = ? WHERE id = ?');
  $stmt->execute([$display_order, $id]);

  Response::success('Orden de los Productos sincronizadas con BD');
}