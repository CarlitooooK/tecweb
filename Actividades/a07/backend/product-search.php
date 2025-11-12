<?php
    header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors','0');

use TECWEB\API\Products;
require_once __DIR__.'/../api/Products.php';

    if (isset($_GET['search'])) {
        $products = new Products('marketzone');
        $products->search($_GET['search']);
        echo $products->getData();
    }
?>