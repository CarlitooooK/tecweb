<?php
    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request;
    use Slim\Factory\AppFactory;

    require 'vendor/autoload.php';
    
    $app = AppFactory::create();
    $app->addBodyParsingMiddleware();
    $app -> setBasePath('/tecweb/Practicas/p14');

    $app -> get('/', function ($request, $response, $args) {
        $response->getBody()->write("Hola Mundo Slim!");
        return $response;
    });

    $app -> get('/hola[/{nombre}]', function ($request, $response, $args) {
        $response->getBody()->write("Hola, " . $args["nombre"]);
        return $response;
    });

    $app -> post('/pruebapost', function ($request, $response, $args) {
        $reqPost = $request->getParsedBody();
        $val1 = $reqPost['valor1'];
        $val2 = $reqPost['valor2'];

        $response->getBody()->write("Valor 1: " . $val1 . " - Valor 2: " . $val2);
        return $response;
    });

    $app -> get('/testjson', function ($request, $response, $args) {
        $data[0]["nombre"] = "Ana";
        $data[0]["apellido"] = "Mendez";
        $data[1]["nombre"] = "Luis";
        $data[1]["apellido"] = "Rojas";
        $response -> getBody()->write(json_encode($data, JSON_PRETTY_PRINT));
        return $response;
    });

    $app -> run();
?>