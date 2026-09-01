<?php

return [
    'host' => $_ENV['DB_HOST'] ?? 'localhost',
    'port' => $_ENV['DB_PORT'] ?? '3306',
    'database' => $_ENV['DB_NAME'] ?? 'cartas_online',
    'username' => $_ENV['DB_USER'] ?? 'cartas_online',
    'password' => $_ENV['DB_PASS'] ?? '1234',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
];