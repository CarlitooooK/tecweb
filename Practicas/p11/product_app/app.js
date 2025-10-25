// JSON BASE A MOSTRAR EN FORMULARIO
var baseJSON = {
    "precio": 0.0,
    "unidades": 1,
    "modelo": "XX-000",
    "marca": "NA",
    "detalles": "NA",
    "imagen": "img/default.png"
  };

// FUNCIÓN CALLBACK DE BOTÓN "Buscar"
function buscarID(e) {
    /**
     * Revisar la siguiente información para entender porqué usar event.preventDefault();
     * http://qbit.com.mx/blog/2013/01/07/la-diferencia-entre-return-false-preventdefault-y-stoppropagation-en-jquery/#:~:text=PreventDefault()%20se%20utiliza%20para,escuche%20a%20trav%C3%A9s%20del%20DOM
     * https://www.geeksforgeeks.org/when-to-use-preventdefault-vs-return-false-in-javascript/
     */
    e.preventDefault();

    // SE OBTIENE EL ID A BUSCAR
    var id = document.getElementById('search').value;

    // SE CREA EL OBJETO DE CONEXIÓN ASÍNCRONA AL SERVIDOR
    var client = getXMLHttpRequest();
    client.open('POST', './backend/read.php', true);
    client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    client.onreadystatechange = function () {
        // SE VERIFICA SI LA RESPUESTA ESTÁ LISTA Y FUE SATISFACTORIA
        if (client.readyState == 4 && client.status == 200) {
            console.log('[CLIENTE]\n'+client.responseText);
            
            // SE OBTIENE EL OBJETO DE DATOS A PARTIR DE UN STRING JSON
            let productos = JSON.parse(client.responseText);    // similar a eval('('+client.responseText+')');
            
            // SE VERIFICA SI EL OBJETO JSON TIENE DATOS
            if(Object.keys(productos).length > 0) {
                // SE CREA UNA LISTA HTML CON LA DESCRIPCIÓN DEL PRODUCTO
                let descripcion = '';
                    descripcion += '<li>precio: '+productos.precio+'</li>';
                    descripcion += '<li>unidades: '+productos.unidades+'</li>';
                    descripcion += '<li>modelo: '+productos.modelo+'</li>';
                    descripcion += '<li>marca: '+productos.marca+'</li>';
                    descripcion += '<li>detalles: '+productos.detalles+'</li>';
                
                // SE CREA UNA PLANTILLA PARA CREAR LA(S) FILA(S) A INSERTAR EN EL DOCUMENTO HTML
                let template = '';
                    template += `
                        <tr>
                            <td>${productos.id}</td>
                            <td>${productos.nombre}</td>
                            <td><ul>${descripcion}</ul></td>
                        </tr>
                    `;

                // SE INSERTA LA PLANTILLA EN EL ELEMENTO CON ID "productos"
                document.getElementById("productos").innerHTML = template;
            }
        }
    };
    client.send("id="+id);
}

function buscarProducto(e) {
    e.preventDefault();

    // SE OBTIENE EL TÉRMINO DE BÚSQUEDA
    var query = document.getElementById('search').value;
    
    if (query.trim() === '') {
        document.getElementById('productos').innerHTML = '<tr><td colspan="3">Ingrese un término de búsqueda.</td></tr>';
        return;
    }

    // SE CREA EL OBJETO DE CONEXIÓN ASÍNCRONA AL SERVIDOR
    var client = getXMLHttpRequest();
    client.open('POST', './backend/read.php', true);
    client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    client.onreadystatechange = function () {
        // SE VERIFICA SI LA RESPUESTA ESTÁ LISTA Y FUE SATISFACTORIA
        if (client.readyState == 4 && client.status == 200) {
            console.log('[CLIENTE]\n'+client.responseText);
            
            var productos;
            var template = '';
            
            // SE OBTIENE EL OBJETO DE DATOS A PARTIR DE UN STRING JSON
            productos = JSON.parse(client.responseText);

            // SE VERIFICA SI EL ARRAY JSON TIENE DATOS
            if (!Array.isArray(productos) || productos.length === 0 || productos.error) {
                // Muestra un mensaje si no hay resultados o si hubo un error de consulta.
                template += '<tr><td colspan="3">No se encontraron productos o hubo un error: ' + (productos.error || 'Lista vacía') + '</td></tr>';
            } else {
                // SE ITERA SOBRE EL ARRAY DE PRODUCTOS Y SE CONSTRUYE LA PLANTILLA DE LA TABLA
                productos.forEach(producto => {
                    
                    // SE CREA UNA LISTA HTML CON LA DESCRIPCIÓN DEL PRODUCTO
                    let descripcion = '';
                    descripcion += '<li>precio: '+producto.precio+'</li>';
                    descripcion += '<li>unidades: '+producto.unidades+'</li>';
                    descripcion += '<li>modelo: '+producto.modelo+'</li>';
                    descripcion += '<li>marca: '+producto.marca+'</li>';
                    descripcion += '<li>detalles: '+producto.detalles+'</li>';
                    descripcion += '<li>imagen: '+producto.imagen+'</li>';
                    
                    // SE CREA UNA PLANTILLA PARA CREAR LA FILA
                    template += `
                        <tr>
                            <td>${producto.id}</td>
                            <td>${producto.nombre}</td>
                            <td><ul>${descripcion}</ul></td>
                        </tr>
                    `;
                });
            }
            
            // SE INSERTA LA PLANTILLA EN EL ELEMENTO CON ID "productos"
            document.getElementById("productos").innerHTML = template;
        }
    };
    // Se envía el parámetro 'busqueda'
    client.send("busqueda="+encodeURIComponent(query));
}

const DEFAULT_IMAGE = 'img/default.png';

// VALIDACIÓN DEL FORMULARIO
function validateForm(){
    const nombre = document.getElementById('nombre').value.trim();
    if(!nombre || nombre.length > 100){ 
        alert('Nombre requerido y máximo 100 caracteres'); 
        return false;
    }

    const marca = document.getElementById('marca').value;
    if(!marca){ 
        alert('Selecciona una marca'); 
        return false; 
    }

    const modelo = document.getElementById('modelo').value.trim();
    if(!modelo || modelo.length > 25 || !/^[A-Za-z0-9\s\-]+$/.test(modelo)){ 
        alert('Modelo requerido: alfanumérico y máximo 25 caracteres'); 
        return false; 
    }

    const precio = parseFloat(document.getElementById('precio').value);
    if(Number.isNaN(precio) || precio <= 99.99){ 
        alert('Precio debe ser mayor a 99.99'); 
        return false; 
    }

    const detalles = document.getElementById('detalles').value;
    if(detalles.length > 250){ 
        alert('Detalles máximo 250 caracteres'); 
        return false; 
    }

    const unidades = parseInt(document.getElementById('unidades').value, 10);
    if(Number.isNaN(unidades) || unidades < 0){ 
        alert('Unidades debe ser un número mayor o igual a 0'); 
        return false; 
    }

    const imagen = document.getElementById('imagen');
    if(!imagen.value.trim()){
        imagen.value = DEFAULT_IMAGE; 
    }

    return true;
}

function agregarProducto(e) {
    e.preventDefault();

    var nombre = document.getElementById('name').value;
    var jsonString = document.getElementById('description').value;
    
    // VALIDACIÓN BÁSICA DEL NOMBRE
    if (nombre.trim() === '') {
        console.error('El nombre del producto no puede estar vacío.');
        alert('El nombre del producto no puede estar vacío.');
        return;
    }

    try {
        var producto = JSON.parse(jsonString);
    } catch (error) {
        console.error('El contenido de la descripción no es un JSON válido:', error);
        alert('El contenido de la descripción no es un JSON válido. Por favor, revíselo.');
        return;
    }

    producto.nombre = nombre; 

    var productoJsonString = JSON.stringify(producto);

    // SE CREA EL OBJETO DE CONEXIÓN ASÍNCRONA AL SERVIDOR
    var client = getXMLHttpRequest();
    client.open('POST', './backend/create.php', true);
    client.setRequestHeader('Content-Type', "application/json;charset=UTF-8");
    client.onreadystatechange = function () {
        // SE VERIFICA SI LA RESPUESTA ESTÁ LISTA Y FUE SATISFACTORIA
        if (client.readyState == 4 && client.status == 200) {
            // MOSTRAR LA RESPUESTA DEL SERVIDOR (Busque el JSON de respuesta aquí)
            console.log(client.responseText);
            alert('Producto agregado. ');
        }
    };
    client.send(productoJsonString);
}

// SE CREA EL OBJETO DE CONEXIÓN COMPATIBLE CON EL NAVEGADOR
function getXMLHttpRequest() {
    var objetoAjax;

    try{
        objetoAjax = new XMLHttpRequest();
    }catch(err1){
        /**
         * NOTA: Las siguientes formas de crear el objeto ya son obsoletas
         *       pero se comparten por motivos historico-académicos.
         */
        try{
            // IE7 y IE8
            objetoAjax = new ActiveXObject("Msxml2.XMLHTTP");
        }catch(err2){
            try{
                // IE5 y IE6
                objetoAjax = new ActiveXObject("Microsoft.XMLHTTP");
            }catch(err3){
                objetoAjax = false;
            }
        }
    }
    return objetoAjax;
}

function init() {
    /**
     * Convierte el JSON a string para poder mostrarlo
     * ver: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON
     */
    var JsonString = JSON.stringify(baseJSON,null,2);
    document.getElementById("description").value = JsonString;
}