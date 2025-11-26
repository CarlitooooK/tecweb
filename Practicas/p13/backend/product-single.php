<?php
    require_once __DIR__ . '/../vendor/autoload.php';
    
    use TECWEB\MYAPI\Read\Read;

    $producto = new Read('marketzone');
    $producto->single($_POST['id']);
    echo $producto->getData();
?>