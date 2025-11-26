<?php
    require_once __DIR__ . '/../vendor/autoload.php';
    
    use TECWEB\MYAPI\Delete\Delete;

    $producto = new Delete('marketzone');
    $producto->delete($_POST['id']);
    echo $producto->getData();
?>