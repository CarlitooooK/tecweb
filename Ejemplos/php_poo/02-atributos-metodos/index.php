<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>02-Atributos y Métodos</title>
</head>
<body>
    <?php
    require_once __DIR__.'/Menu.php';

    $menu = new Menu;
    $menu->cargar_opcion('https://www.facebook.com','Facebook');
    $menu->cargar_opcion('https://www.instagram.com','Instagram');
    $menu->cargar_opcion('https://www.X.com','X');

    ?>
    
</body>
</html>