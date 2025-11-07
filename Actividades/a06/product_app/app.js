$(document).ready(function(){
    let edit = false;
    let nombreDisponible = true;

    $('#product-result').hide();
    listarProductos();

    // Función para mostrar mensaje en la barra de estado
    function mostrarEstado(mensaje, tipo) {
        let template = `<li style="list-style: none; color: ${tipo === 'ERROR' ? '#ffffffff' : '#ffffffff'};">${mensaje}</li>`;
        $('#container').html(template);
        $('#product-result').show();
    }

    // Validación asíncrona del nombre al teclear
    let nombreTimeout;
    $('#name').on('keyup', function() {
        clearTimeout(nombreTimeout);
        const nombre = $(this).val().trim();
        
        if (nombre === '') {
            $('#product-result').hide();
            nombreDisponible = false;
            return;
        }
        
        nombreTimeout = setTimeout(function() {
            // Verificar si el nombre ya existe en la BD
            $.ajax({
                url: './backend/product-search.php?search=' + nombre,
                type: 'GET',
                success: function(response) {
                    const productos = JSON.parse(response);
                    const productoExistente = productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
                    const productIdActual = $('#productId').val();
                    
                    if (productoExistente && productoExistente.id != productIdActual) {
                        mostrarEstado('Ya existe un producto con ese nombre', 'ERROR');
                        nombreDisponible = false;
                    } else {
                        $('#product-result').hide();
                        nombreDisponible = true;
                    }
                }
            });
        }, 500); // Esperar 500ms después de que el usuario deje de escribir
    });

    // Validación de nombre al cambiar de campo
    $('#name').on('blur', function() {
        const nombre = $(this).val().trim();
        if (nombre === '') {
            mostrarEstado('El nombre del producto es requerido', 'ERROR');
        } else if (nombre.length > 100) {
            mostrarEstado('El nombre no puede exceder 100 caracteres', 'ERROR');
        }
    });

    // Validación de marca
    $('#marca').on('blur', function() {
        const marca = $(this).val().trim();
        if (marca === '') {
            mostrarEstado('La marca es requerida', 'ERROR');
        } else if (marca.length > 25) {
            mostrarEstado('La marca no puede exceder 25 caracteres', 'ERROR');
        } else {
            $('#product-result').hide();
        }
    });

    // Validación de modelo
    $('#modelo').on('blur', function() {
        const modelo = $(this).val().trim();
        const regexModelo = /^[a-zA-Z0-9\-]+$/;
        
        if (modelo === '') {
            mostrarEstado('El modelo es requerido', 'ERROR');
        } else if (modelo.length > 25) {
            mostrarEstado('El modelo no puede exceder 25 caracteres', 'ERROR');
        } else if (!regexModelo.test(modelo)) {
            mostrarEstado('El modelo solo puede contener letras, números y guiones', 'ERROR');
        } else {
            $('#product-result').hide();
        }
    });

    // Validación de precio
    $('#precio').on('blur', function() {
        const precio = parseFloat($(this).val());
        if (isNaN(precio) || $(this).val().trim() === '') {
            mostrarEstado('El precio es requerido', 'ERROR');
        } else if (precio < 99.99) {
            mostrarEstado('El precio debe ser mayor o igual a $99.99', 'ERROR');
        } else {
            $('#product-result').hide();
        }
    });

    // Validación de unidades
    $('#unidades').on('blur', function() {
        const unidades = parseInt($(this).val());
        if (isNaN(unidades) || $(this).val().trim() === '') {
            mostrarEstado('Las unidades son requeridas', 'ERROR');
        } else if (unidades < 0) {
            mostrarEstado('Las unidades no pueden ser negativas', 'ERROR');
        } else {
            $('#product-result').hide();
        }
    });

    // Validación de detalles
    $('#detalles').on('blur', function() {
        const detalles = $(this).val().trim();
        if (detalles.length > 250) {
            mostrarEstado('Los detalles no pueden exceder 250 caracteres', 'ERROR');
        } else {
            $('#product-result').hide();
        }
    });

    function listarProductos() {
        $.ajax({
            url: './backend/product-list.php',
            type: 'GET',
            success: function(response) {
                const productos = JSON.parse(response);
                if(Object.keys(productos).length > 0) {
                    let template = '';
                    productos.forEach(producto => {
                        let descripcion = '';
                        descripcion += '<li>precio: '+producto.precio+'</li>';
                        descripcion += '<li>unidades: '+producto.unidades+'</li>';
                        descripcion += '<li>modelo: '+producto.modelo+'</li>';
                        descripcion += '<li>marca: '+producto.marca+'</li>';
                        descripcion += '<li>detalles: '+producto.detalles+'</li>';
                    
                        template += `
                            <tr productId="${producto.id}">
                                <td>${producto.id}</td>
                                <td><a href="#" class="product-item">${producto.nombre}</a></td>
                                <td><ul>${descripcion}</ul></td>
                                <td>
                                    <button class="product-delete btn btn-danger btn-sm">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                    $('#products').html(template);
                }
            }
        });
    }

    $('#search').keyup(function() {
        if($('#search').val()) {
            let search = $('#search').val();
            $.ajax({
                url: './backend/product-search.php?search='+search,
                type: 'GET',
                success: function (response) {
                    const productos = JSON.parse(response);
                    if(Object.keys(productos).length > 0) {
                        let template = '';
                        let template_bar = '';
                        productos.forEach(producto => {
                            let descripcion = '';
                            descripcion += '<li>precio: '+producto.precio+'</li>';
                            descripcion += '<li>unidades: '+producto.unidades+'</li>';
                            descripcion += '<li>modelo: '+producto.modelo+'</li>';
                            descripcion += '<li>marca: '+producto.marca+'</li>';
                            descripcion += '<li>detalles: '+producto.detalles+'</li>';
                        
                            template += `
                                <tr productId="${producto.id}">
                                    <td>${producto.id}</td>
                                    <td><a href="#" class="product-item">${producto.nombre}</a></td>
                                    <td><ul>${descripcion}</ul></td>
                                    <td>
                                        <button class="product-delete btn btn-danger btn-sm">
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            `;
                            template_bar += `<li>${producto.nombre}</li>`;
                        });
                        $('#product-result').show();
                        $('#container').html(template_bar);
                        $('#products').html(template);    
                    }
                }
            });
        } else {
            $('#product-result').hide();
            listarProductos();
        }
    });

    $('#product-form').submit(e => {
        e.preventDefault();

        // Obtener valores
        const nombre = $('#name').val().trim();
        const marca = $('#marca').val().trim();
        const modelo = $('#modelo').val().trim();
        const precio = parseFloat($('#precio').val());
        const unidades = parseInt($('#unidades').val());
        const detalles = $('#detalles').val().trim();
        const regexModelo = /^[a-zA-Z0-9\-]+$/;

        // Validaciones antes de enviar
        if (nombre === '' ||nombre.length > 100 || !nombreDisponible) {
            mostrarEstado('Nombre vacío o no disponible', 'ERROR');
            return;
        }
        if (marca === '' || marca.length > 25) {
            mostrarEstado('Marca vacía o demasiado larga', 'ERROR');
            return;
        }
        if (modelo === '' || modelo.length > 25 || !regexModelo.test(modelo)) {
            mostrarEstado('Modelo vacío o inválido', 'ERROR');
            return;
        }
        if (isNaN(precio) || precio < 99.99) {
            mostrarEstado('Precio inválido o menor a $99.99', 'ERROR');
            return;
        }
        if (isNaN(unidades) || unidades < 0) {
            mostrarEstado('Unidades inválidas o negativas', 'ERROR');
            return;
        }
        if (detalles.length > 250) {
            mostrarEstado('Los detalles no pueden exceder 250 caracteres', 'ERROR');
            return;
        }

        // Construir objeto con datos del formulario
        let postData = {
            nombre: nombre,
            marca: marca,
            modelo: modelo,
            precio: precio,
            unidades: unidades,
            detalles: detalles || 'NA',
            imagen: $('#imagen').val().trim() || 'img/default.png',
            id: $('#productId').val()
        };

        const url = edit === false ? './backend/product-add.php' : './backend/product-edit.php';
        
        $.post(url, postData, (response) => {
            let respuesta = JSON.parse(response);
            let template_bar = `
                <li style="list-style: none;">status: ${respuesta.status}</li>
                <li style="list-style: none;">message: ${respuesta.message}</li>
            `;
            
            // Limpiar formulario
            $('#name').val('');
            $('#marca').val('');
            $('#modelo').val('');
            $('#precio').val('');
            $('#unidades').val('');
            $('#detalles').val('');
            $('#imagen').val('');
            $('#productId').val('');
            
            $('#product-result').show();
            $('#container').html(template_bar);
            listarProductos();
            edit = false;
            nombreDisponible = true;
        });
    });

    $(document).on('click', '.product-delete', function(e) {
        if(confirm('¿Realmente deseas eliminar el producto?')) {
            const element = $(this).closest('tr');
            const id = $(element).attr('productId');
            $.post('./backend/product-delete.php', {id}, (response) => {
                $('#product-result').hide();
                listarProductos();
            });
        }
    });

    $(document).on('click', '.product-item', function(e) {
        e.preventDefault();
        const element = $(this).closest('tr');
        const id = $(element).attr('productId');
        $.post('./backend/product-single.php', {id}, (response) => {
            let product = JSON.parse(response);
            
            $('#name').val(product.nombre);
            $('#marca').val(product.marca);
            $('#modelo').val(product.modelo);
            $('#precio').val(product.precio);
            $('#unidades').val(product.unidades);
            $('#detalles').val(product.detalles);
            $('#imagen').val(product.imagen);
            $('#productId').val(product.id);
            
            $('#product-result').hide();
            edit = true;
            nombreDisponible = true; 
        });
    });
});