<?php
// includes/Auth.php

class Auth
{
    private static $secretKey;
    private static $tokenHeader = 'HTTP_X_AUTH_TOKEN'; // Header personalizado
    
    public static function init()
    {
        self::$secretKey = $_ENV['JWT_SECRET'] ?? 'tu-secret-key-muy-segura';
    }
    
    /**
     * Genera un token JWT
     */
    public static function generateToken($userId, $email)
    {
        $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        
        $payload = base64_encode(json_encode([
            'user_id' => $userId,
            'email' => $email,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24 * 7), // 7 días
        ]));
        
        $signature = hash_hmac('sha256', $header . '.' . $payload, self::$secretKey, true);
        $signature = base64_encode($signature);
        
        return $header . '.' . $payload . '.' . $signature;
    }
    
    /**
     * Valida un token JWT
     */
    public static function validateToken($token)
    {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return false;
        }
        
        list($header, $payload, $signature) = $parts;
        
        $expectedSignature = base64_encode(
            hash_hmac('sha256', $header . '.' . $payload, self::$secretKey, true)
        );
        
        if ($signature !== $expectedSignature) {
            return false;
        }
        
        $payloadData = json_decode(base64_decode($payload), true);
        
        if (!isset($payloadData['exp']) || $payloadData['exp'] < time()) {
            return false;
        }
        
        return $payloadData;
    }
    
    /**
     * Obtiene el token desde el header personalizado
     */
    public static function getTokenFromHeader()
    {
        $headers = getallheaders();
        
        // Buscar en headers estándar
        $token = $headers['X-Auth-Token'] ?? 
                 $headers['x-auth-token'] ?? 
                 $_SERVER[self::$tokenHeader] ?? 
                 null;
        
        // Si no se encuentra, intentar con diferentes variantes
        if (!$token) {
            // Algunos servidores usan HTTP_X_AUTH_TOKEN
            if (isset($_SERVER['HTTP_X_AUTH_TOKEN'])) {
                $token = $_SERVER['HTTP_X_AUTH_TOKEN'];
            }
            // Otros usan X_AUTH_TOKEN
            elseif (isset($_SERVER['X_AUTH_TOKEN'])) {
                $token = $_SERVER['X_AUTH_TOKEN'];
            }
        }
        
        return $token;
    }
    
    /**
     * Obtiene el usuario autenticado
     */
    public static function getAuthenticatedUser()
    {
        $token = self::getTokenFromHeader();
        
        if (empty($token)) {
            Response::error('Token no proporcionado', 401);
        }
        
        $payload = self::validateToken($token);
        
        if (!$payload) {
            Response::error('Token inválido o expirado', 401);
        }
        
        return $payload;
    }
    
    /**
     * Obtiene el usuario autenticado (sin lanzar error)
     */
    public static function getAuthenticatedUserOrNull()
    {
        $token = self::getTokenFromHeader();
        
        if (empty($token)) {
            return null;
        }
        
        $payload = self::validateToken($token);
        
        if (!$payload) {
            return null;
        }
        
        return $payload;
    }
    
    /**
     * Verifica que el usuario tenga acceso a un negocio
     */
    public static function verifyBusinessAccess($businessId, $userId)
    {
        $db = Database::getInstance()->getConnection();
        
        $stmt = $db->prepare("SELECT id FROM businesses WHERE id = ? AND user_id = ?");
        $stmt->execute([$businessId, $userId]);
        
        if (!$stmt->fetch()) {
            Response::error('No tiene acceso a este negocio', 403);
        }
        
        return true;
    }
}

Auth::init();