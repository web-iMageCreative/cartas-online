<?php

class Response
{
    /**
     * Envía una respuesta JSON exitosa
     */
    public static function success($data = null, $message = 'Operación exitosa', $code = 200)
    {
        self::send([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }
    
    /**
     * Envía una respuesta JSON de error
     */
    public static function error($message = 'Error en la operación', $code = 400, $errors = null)
    {
        self::send([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }
    
    /**
     * Envía una respuesta JSON de autenticación
     */
    public static function auth($token, $user, $message = 'Autenticación exitosa')
    {
        self::send([
            'success' => true,
            'message' => $message,
            'data' => [
                'token' => $token,
                'user' => $user,
            ],
        ], 200);
    }
    
    /**
     * Envía una respuesta JSON con paginación
     */
    public static function paginated($data, $total, $page, $limit, $message = 'Listado exitoso')
    {
        self::send([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'pagination' => [
                'total' => (int) $total,
                'page' => (int) $page,
                'limit' => (int) $limit,
                'pages' => (int) ceil($total / $limit),
            ],
        ], 200);
    }
    
    /**
     * Envía la respuesta con los headers adecuados
     */
    private static function send($data, $code)
    {
        http_response_code($code);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }
}