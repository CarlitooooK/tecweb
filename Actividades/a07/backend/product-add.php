<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', '0'); // evita que los warnings rompan el JSON

use TECWEB\API\Products;
require_once __DIR__.'/../api/Products.php';

if (isset($_POST['nombre'])) {
    $jsonOBJ = json_decode(json_encode($_POST));
    $products = new Products('marketzone');
    $products->add($jsonOBJ);
    echo $products->getData();
    exit;
}

echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
?>
