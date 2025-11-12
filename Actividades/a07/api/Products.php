<?php
namespace TECWEB\API;

require_once __DIR__.'/DataBase.php';

class Products extends DataBase{
    private $data = array();

    public function __construct(string $db, string $user = 'root', string $pass = 'bebecarlo', string $host = 'localhost'){
        parent::__construct($db, $user, $pass, $host);
    }

    public function add($jsonOBJ): void{
        $data = array(
            'status'  => 'error',
            'message' => 'Ya existe un producto con ese nombre'
        );

        $sql = "SELECT * FROM productos WHERE nombre = '{$jsonOBJ->nombre}' AND eliminado = 0";
        $result = $this->conexion->query($sql);

        if ($result->num_rows == 0) {
            $this->conexion->set_charset("utf8");
            $sql = "INSERT INTO productos VALUES (null, '{$jsonOBJ->nombre}', '{$jsonOBJ->marca}', '{$jsonOBJ->modelo}', 
                                                    {$jsonOBJ->precio}, '{$jsonOBJ->detalles}', {$jsonOBJ->unidades}, '{$jsonOBJ->imagen}', 0)";
            if ($this->conexion->query($sql)) {
                $data['status'] =  "success";
                $data['message'] =  "Producto agregado";
            } else {
                $data['message'] = "ERROR: No se ejecuto $sql. " . mysqli_error($this->conexion);
            }
        }

        $result->free();
        $this->data = $data;
    }

    public function delete(string $id): void{
        $data = array(
            'status'  => 'error',
            'message' => 'La consulta falló'
        );
        
        $sql = "UPDATE productos SET eliminado=1 WHERE id = {$id}";
        if ($this->conexion->query($sql)) {
            $data['status'] =  "success";
            $data['message'] =  "Producto eliminado";
        } else {
            $data['message'] = "ERROR: No se ejecuto $sql. " . mysqli_error($this->conexion);
        }

        $this->data = $data;
    }

    public function edit($jsonOBJ): void{
        $data = array(
            'status'  => 'error',
            'message' => 'La consulta falló'
        );

        $sql =  "UPDATE productos SET nombre='{$jsonOBJ->nombre}', marca='{$jsonOBJ->marca}',";
        $sql .= "modelo='{$jsonOBJ->modelo}', precio={$jsonOBJ->precio}, detalles='{$jsonOBJ->detalles}',"; 
        $sql .= "unidades={$jsonOBJ->unidades}, imagen='{$jsonOBJ->imagen}' WHERE id={$jsonOBJ->id}";
        
        $this->conexion->set_charset("utf8");
        if ($this->conexion->query($sql)) {
            $data['status'] =  "success";
            $data['message'] =  "Producto actualizado";
        } else {
            $data['message'] = "ERROR: No se ejecuto $sql. " . mysqli_error($this->conexion);
        }

        $this->data = $data;
    }

    public function list(): void{
        $data = array();
        $sql = "SELECT * FROM productos WHERE eliminado = 0";

        if ($result = $this->conexion->query($sql)) {
            $rows = $result->fetch_all(MYSQLI_ASSOC);

            if (!is_null($rows)) {
                foreach ($rows as $num => $row) {
                    foreach ($row as $key => $value) {
                        $data[$num][$key] = utf8_encode($value);
                    }
                }
            }
            $result->free();
        } else {
            die('Error: ' . mysqli_error($this->conexion));
        }

        $this->data = $data;
    }

    public function search(string $search): void{
        $data = array();
        $sql = "SELECT * FROM productos WHERE (id = '{$search}' OR nombre LIKE '%{$search}%' OR marca LIKE '%{$search}%' 
                                                OR detalles LIKE '%{$search}%') AND eliminado = 0";
        
        if ($result = $this->conexion->query($sql)) {
            $rows = $result->fetch_all(MYSQLI_ASSOC);

            if (!is_null($rows)) {
                foreach ($rows as $num => $row) {
                    foreach ($row as $key => $value) {
                        $data[$num][$key] = utf8_encode($value);
                    }
                }
            }
            $result->free();
        } else {
            die('Error: ' . mysqli_error($this->conexion));
        }

        $this->data = $data;
    }

    public function single(string $id): void{
        $data = array();
        $sql = "SELECT * FROM productos WHERE id = {$id}";
        
        if ($result = $this->conexion->query($sql)) {
            $row = $result->fetch_assoc();

            if (!is_null($row)) {
                foreach ($row as $key => $value) {
                    $data[$key] = utf8_encode($value);
                }
            }
            $result->free();
        } else {
            die('Error: ' . mysqli_error($this->conexion));
        }

        $this->data = $data;
    }

    public function singleByName(string $nombre): void{
        $data = array();
        $sql = "SELECT * FROM productos WHERE nombre = '{$nombre}' AND eliminado = 0";
        
        if ($result = $this->conexion->query($sql)) {
            $row = $result->fetch_assoc();

            if (!is_null($row)) {
                foreach ($row as $key => $value) {
                    $data[$key] = utf8_encode($value);
                }
            }
            $result->free();
        } else {
            die('Error: ' . mysqli_error($this->conexion));
        }

        $this->data = $data;
    }

    public function getData(): string{
        $this->conexion->close();
        return json_encode($this->data, JSON_PRETTY_PRINT); 
    }
}
?>