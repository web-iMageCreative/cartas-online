<?php

class Validator
{
    /**
     * Valida campos requeridos
     */
    public static function required($data, $fields)
    {
        $errors = [];
        
        foreach ($fields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                $errors[$field] = "El campo {$field} es requerido";
            }
        }
        
        return $errors;
    }
    
    /**
     * Valida que sea un email válido
     */
    public static function email($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
    
    /**
     * Valida que sea un número
     */
    public static function numeric($value)
    {
        return is_numeric($value);
    }
    
    /**
     * Valida longitud mínima
     */
    public static function minLength($value, $min)
    {
        return strlen($value) >= $min;
    }
    
    /**
     * Valida longitud máxima
     */
    public static function maxLength($value, $max)
    {
        return strlen($value) <= $max;
    }
    
    /**
     * Sanitiza datos de entrada
     */
    public static function sanitize($data)
    {
        if (is_array($data)) {
            return array_map([self::class, 'sanitize'], $data);
        }
        
        return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
    }
}