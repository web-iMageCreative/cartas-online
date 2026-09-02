<?php

return [
    'host' => $_ENV['DB_HOST'] ?? 'localhost',
    'port' => $_ENV['DB_PORT'] ?? '3306',
    'database' => $_ENV['DB_NAME'] ?? 'digital_menu',
    'username' => $_ENV['DB_USER'] ?? 'Carta',
    'password' => $_ENV['DB_PASS'] ?? 'Carta123',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
];