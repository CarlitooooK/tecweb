var baseJSON = {
    "precio": 0.0,
    "unidades": 1,
    "modelo": "XX-000",
    "marca": "NA",
    "detalles": "NA",
    "imagen": "img/default.png"
};

$(document).ready(function(){
    let edit = false;
    let JsonString = JSON.stringify(baseJSON, null, 2);
    $('#description').val(JsonString);
    $('#product-result').hide();
    listarProductos();

    function validarProducto(postData) {
        let errores = [];

        if (!postData.nombre || postData.nombre.trim() === '') {
            errores.push('El nombre es requerido');
        } else if (postData.nombre.length > 100) {
            errores.push('El nombre no debe exceder 100 caracteres');
        }

        const marcasValidas = ['NA', 'Samsung', 'LG', 'Sony', 'Apple', 'HP', 'Lenovo', 'Dell', 'Asus', 'Canon'];
        if (!postData.marca || postData.marca.trim() === '') {
            errores.push('La marca es requerida');
        } else if (!marcasValidas.includes(postData.marca)) {
            errores.push('La marca seleccionada no es válida. Opciones: ' + marcasValidas.join(', '));
        }

        const modeloRegex = /^[a-zA-Z0-9\-]+$/;
        if (!postData.modelo || postData.modelo.trim() === '') {
            errores.push('El modelo es requerido');
        } else if (!modeloRegex.test(postData.modelo)) {
            errores.push('El modelo debe ser alfanumérico (solo letras, números y guiones)');
        } else if (postData.modelo.length > 25) {
            errores.push('El modelo no debe exceder 25 caracteres');
        }

        if (postData.precio === '' || postData.precio === null || postData.precio === undefined) {
            errores.push('El precio es requerido');
        } else if (isNaN(postData.precio) || parseFloat(postData.precio) <= 99.99) {
            errores.push('El precio debe ser mayor a 99.99');
        }

        if (postData.detalles && postData.detalles.length > 250) {
            errores.push('Los detalles no deben exceder 250 caracteres');
        }

        if (postData.unidades === '' || postData.unidades === null || postData.unidades === undefined) {
            errores.push('Las unidades son requeridas');
        } else if (isNaN(postData.unidades) || parseInt(postData.unidades) < 0) {
            errores.push('Las unidades deben ser un número mayor o igual a 0');
        }

        if (!postData.imagen || postData.imagen.trim() === '') {
            postData.imagen = 'img/default.png';
        }

        return {
            valido: errores.length === 0,
            errores: errores
        };
    }

    function listarProductos() {
        $.ajax({
            url: './backend/product-list.php',
            type: 'GET',
            success: function(response) {
                console.log(response);
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
                                    <button class="product-edit btn btn-warning">
                                        Editar
                                    </button>
                                    <button class="product-delete btn btn-danger">
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
                url: './backend/product-search.php?search='+$('#search').val(),
                data: {search},
                type: 'GET',
                success: function (response) {
                    if(!response.error) {
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
                                            <button class="product-edit btn btn-warning">
                                                Editar
                                            </button>
                                            <button class="product-delete btn btn-danger">
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                `;
                                template_bar += `
                                    <li>${producto.nombre}</li>
                                `;
                            });
                            $('#product-result').show();
                            $('#container').html(template_bar);
                            $('#products').html(template);    
                        }
                    }
                }
            });
        }
        else {
            $('#product-result').hide();
        }
    });

    $('#product-form').submit(e => {
        e.preventDefault();
        
        let postData = JSON.parse($('#description').val());
        postData['nombre'] = $('#name').val();
        postData['id'] = $('#productId').val();

        const validacion = validarProducto(postData);

        if (!validacion.valido) {
            let template_bar = '<li style="list-style: none;">status: error</li>';
            validacion.errores.forEach(error => {
                template_bar += `<li style="list-style: none;">${error}</li>`;
            });
            
            $('#product-result').show();
            $('#container').html(template_bar);
        } else {
            const url = edit === false ? './backend/product-add.php' : './backend/product-edit.php';
            
            $.post(url, postData, (response) => {
                console.log(response);
                let respuesta = JSON.parse(response);
                
                let template_bar = '';
                template_bar += `
                    <li style="list-style: none;">status: ${respuesta.status}</li>
                    <li style="list-style: none;">message: ${respuesta.message}</li>
                `;
                
                $('#name').val('');
                $('#description').val(JsonString);
                $('#productId').val('');
                
                $('#product-result').show();
                $('#container').html(template_bar);
                listarProductos();
                edit = false;
                updateButtonText();
            });
        }
    });

    function updateButtonText() {
        const buttonText = edit ? 'Actualizar Producto' : 'Agregar Producto';
        $('#product-form button[type="submit"]').text(buttonText);
    }

    $(document).on('click', '.product-edit', (e) => {
        e.preventDefault();
        const element = $(e.target).closest('tr');
        const id = $(element).attr('productId');
        $.post('./backend/product-single.php', {id}, (response) => {
            let product = JSON.parse(response);
            $('#name').val(product.nombre);
            $('#productId').val(product.id);
            delete(product.nombre);
            delete(product.eliminado);
            delete(product.id);
            let JsonString = JSON.stringify(product, null, 2);
            $('#description').val(JsonString);
            
            edit = true;
            updateButtonText();
            $('html, body').animate({scrollTop: $('#product-form').offset().top}, 500);
        });
    });

    $(document).on('click', '.product-delete', (e) => {
        e.preventDefault();
        if(confirm('¿Realmente deseas eliminar el producto?')) {
            const element = $(e.target).closest('tr');
            const id = $(element).attr('productId');
            $.post('./backend/product-delete.php', {id}, (response) => {
                $('#product-result').hide();
                listarProductos();
            });
        }
    });

    $(document).on('click', '.product-item', (e) => {
        e.preventDefault();
        const element = $(e.target).closest('tr');
        const id = $(element).attr('productId');
        $.post('./backend/product-single.php', {id}, (response) => {
            let product = JSON.parse(response);
            $('#name').val(product.nombre);
            $('#productId').val(product.id);
            delete(product.nombre);
            delete(product.eliminado);
            delete(product.id);
            let JsonString = JSON.stringify(product, null, 2);
            $('#description').val(JsonString);
            
            edit = true;
            updateButtonText();
            $('html, body').animate({scrollTop: $('#product-form').offset().top}, 500);
        });
    });    
});