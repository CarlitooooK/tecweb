<?php
namespace TECWEB\API;

abstract class DataBase
{ 
    protected $conexion;

    public function __construct(string $db, string $user, string $pass, string $host = 'localhost')
    {
        $this->conexion = @mysqli_connect($host, $user, $pass, $db);

        if (!$this->conexion) {
            die('Base de datos NO conectada');
        }
    }
}
?>