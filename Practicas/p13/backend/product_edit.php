<?php
    require_once __DIR__ . '/../vendor/autoload.php';
    
    use TECWEB\MYAPI\Update\Update;

    $producto = new Update('marketzone');
    $producto->edit(json_decode(json_encode($_POST)));
    echo $producto->getData();
?>