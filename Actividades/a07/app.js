$(document).ready(function () {
  let edit = false;
  let nombreDisponible = true;

  const BASE = './backend'; // ajusta si usas ruta absoluta

  $('#product-result').hide();
  listarProductos();

  function mostrarEstado(mensaje, tipo = 'ERROR') {
    const template = `<li style="list-style:none;color:#fff;">${mensaje}</li>`;
    $('#container').html(template);
    $('#product-result').show();
  }

  // --- Validación asíncrona del nombre ---
  let nombreTimeout;
  $('#name').on('keyup', function () {
    clearTimeout(nombreTimeout);
    const nombre = $(this).val().trim();

    if (nombre === '') {
      $('#product-result').hide();
      nombreDisponible = false;
      return;
    }

    nombreTimeout = setTimeout(function () {
      $.ajax({
        url: `${BASE}/product-search.php`,
        type: 'GET',
        dataType: 'json',
        data: { search: nombre },
      })
        .done(function (productos) {
          const productoExistente = (productos || []).find(
            (p) => (p.nombre || '').toLowerCase() === nombre.toLowerCase()
          );
          const productIdActual = $('#productId').val();

          if (productoExistente && productoExistente.id != productIdActual) {
            mostrarEstado('Ya existe un producto con ese nombre', 'ERROR');
            nombreDisponible = false;
          } else {
            $('#product-result').hide();
            nombreDisponible = true;
          }
        })
        .fail((jq) => {
          mostrarEstado(`Search fail ${jq.status}: ${jq.responseText?.slice(0, 120) || ''}`);
        });
    }, 500);
  });

  // --- Validaciones de blur (igual que las tuyas) ---
  $('#name').on('blur', function () {
    const nombre = $(this).val().trim();
    if (nombre === '') mostrarEstado('El nombre del producto es requerido', 'ERROR');
    else if (nombre.length > 100) mostrarEstado('El nombre no puede exceder 100 caracteres', 'ERROR');
  });

  $('#marca').on('blur', function () {
    const marca = $(this).val().trim();
    if (marca === '') mostrarEstado('La marca es requerida', 'ERROR');
    else if (marca.length > 25) mostrarEstado('La marca no puede exceder 25 caracteres', 'ERROR');
    else $('#product-result').hide();
  });

  $('#modelo').on('blur', function () {
    const modelo = $(this).val().trim();
    const regexModelo = /^[a-zA-Z0-9\-]+$/;
    if (modelo === '') mostrarEstado('El modelo es requerido', 'ERROR');
    else if (modelo.length > 25) mostrarEstado('El modelo no puede exceder 25 caracteres', 'ERROR');
    else if (!regexModelo.test(modelo)) mostrarEstado('El modelo solo puede contener letras, números y guiones', 'ERROR');
    else $('#product-result').hide();
  });

  $('#precio').on('blur', function () {
    const precio = parseFloat($(this).val());
    if (isNaN(precio) || $(this).val().trim() === '') mostrarEstado('El precio es requerido', 'ERROR');
    else if (precio < 99.99) mostrarEstado('El precio debe ser mayor o igual a $99.99', 'ERROR');
    else $('#product-result').hide();
  });

  $('#unidades').on('blur', function () {
    const unidades = parseInt($(this).val());
    if (isNaN(unidades) || $(this).val().trim() === '') mostrarEstado('Las unidades son requeridas', 'ERROR');
    else if (unidades < 0) mostrarEstado('Las unidades no pueden ser negativas', 'ERROR');
    else $('#product-result').hide();
  });

  $('#detalles').on('blur', function () {
    const detalles = $(this).val().trim();
    if (detalles.length > 250) mostrarEstado('Los detalles no pueden exceder 250 caracteres', 'ERROR');
    else $('#product-result').hide();
  });

  // --- Listar productos ---
  function listarProductos() {
    $.ajax({
      url: `${BASE}/product-list.php`,
      type: 'GET',
      dataType: 'json',
    })
      .done(function (productos) {
        if (productos && Object.keys(productos).length > 0) {
          let template = '';
          productos.forEach((producto) => {
            let descripcion = '';
            descripcion += '<li>precio: ' + producto.precio + '</li>';
            descripcion += '<li>unidades: ' + producto.unidades + '</li>';
            descripcion += '<li>modelo: ' + producto.modelo + '</li>';
            descripcion += '<li>marca: ' + producto.marca + '</li>';
            descripcion += '<li>detalles: ' + producto.detalles + '</li>';

            template += `
              <tr productId="${producto.id}">
                <td>${producto.id}</td>
                <td><a href="#" class="product-item">${producto.nombre}</a></td>
                <td><ul>${descripcion}</ul></td>
                <td>
                  <button class="btn btn-warning btn-sm product-edit">Editar</button>
                  <button class="btn btn-danger btn-sm product-delete">Eliminar</button>
                </td>
              </tr>
            `;
          });
          $('#products').html(template);
        }
      })
      .fail((jq) => {
        mostrarEstado(`List fail ${jq.status}: ${jq.responseText?.slice(0, 120) || ''}`);
      });
  }

  // --- Buscador ---
  $('#search').keyup(function () {
    const val = $('#search').val();
    if (val) {
      $.ajax({
        url: `${BASE}/product-search.php`,
        type: 'GET',
        dataType: 'json',
        data: { search: val },
      })
        .done(function (productos) {
          if (productos && Object.keys(productos).length > 0) {
            let template = '';
            let template_bar = '';
            productos.forEach((producto) => {
              let descripcion = '';
              descripcion += '<li>precio: ' + producto.precio + '</li>';
              descripcion += '<li>unidades: ' + producto.unidades + '</li>';
              descripcion += '<li>modelo: ' + producto.modelo + '</li>';
              descripcion += '<li>marca: ' + producto.marca + '</li>';
              descripcion += '<li>detalles: ' + producto.detalles + '</li>';

              template += `
                <tr productId="${producto.id}">
                  <td>${producto.id}</td>
                  <td><a href="#" class="product-item">${producto.nombre}</a></td>
                  <td><ul>${descripcion}</ul></td>
                  <td>
                    <button class="btn btn-warning btn-sm product-edit">Editar</button>
                    <button class="btn btn-danger btn-sm product-delete">Eliminar</button>
                  </td>
                </tr>
              `;
              template_bar += `<li>${producto.nombre}</li>`;
            });
            $('#product-result').show();
            $('#container').html(template_bar);
            $('#products').html(template);
          }
        })
        .fail((jq) => {
          mostrarEstado(`Search fail ${jq.status}: ${jq.responseText?.slice(0, 120) || ''}`);
        });
    } else {
      $('#product-result').hide();
      listarProductos();
    }
  });

  // --- Submit (add/edit) ---
  $('#product-form').submit((e) => {
    e.preventDefault();

    // Obtener valores
    const nombre = $('#name').val().trim();
    const marca = $('#marca').val().trim();
    const modelo = $('#modelo').val().trim();
    const precio = parseFloat($('#precio').val());
    const unidades = parseInt($('#unidades').val());
    const detalles = $('#detalles').val().trim();
    const regexModelo = /^[a-zA-Z0-9\-]+$/;

    // Validaciones mínimas (tu lógica)
    if (!marca || marca.length > 25) return mostrarEstado('Marca vacía o demasiado larga', 'ERROR');
    if (!modelo || modelo.length > 25 || !regexModelo.test(modelo))
      return mostrarEstado('Modelo vacío o inválido', 'ERROR');
    if (isNaN(precio) || precio < 99.99) return mostrarEstado('Precio inválido o menor a $99.99', 'ERROR');
    if (isNaN(unidades) || unidades < 0) return mostrarEstado('Unidades inválidas o negativas', 'ERROR');
    if (detalles.length > 250) return mostrarEstado('Los detalles no pueden exceder 250 caracteres', 'ERROR');

    const postData = {
      nombre,
      marca,
      modelo,
      precio,
      unidades,
      detalles: detalles || 'NA',
      imagen: $('#imagen').val().trim() || 'img/default.png',
      id: $('#productId').val(),
    };

    // IMPORTANTE: nombre correcto del archivo: product_add.php
    const url = edit === false ? `${BASE}/product-add.php` : `${BASE}/product-edit.php`;

    $.ajax({
      url,
      method: 'POST',
      data: postData,
      dataType: 'json',
    })
      .done((respuesta) => {
        const template_bar = `
          <li style="list-style:none;">status: ${respuesta.status}</li>
          <li style="list-style:none;">message: ${respuesta.message}</li>
        `;
        $('#product-form')[0].reset();
        $('#productId').val('');
        $('#product-result').show();
        $('#container').html(template_bar);
        listarProductos();
        edit = false;
        nombreDisponible = true;
      })
      .fail((jq) => {
        mostrarEstado(`POST fail ${jq.status}: ${jq.responseText?.slice(0, 200) || ''}`);
      });
  });

  // --- Editar ---
  $(document).on('click', '.product-edit', function (e) {
    e.preventDefault();
    const productItem = $(this).closest('tr').find('.product-item');
    productItem.click();
  });

  // --- Eliminar ---
  $(document).on('click', '.product-delete', function () {
    if (!confirm('¿Realmente deseas eliminar el producto?')) return;
    const id = $(this).closest('tr').attr('productId');

    $.ajax({
      url: `${BASE}/product-delete.php`,
      method: 'POST',
      dataType: 'json',
      data: { id },
    })
      .done(() => {
        $('#product-result').hide();
        listarProductos();
      })
      .fail((jq) => mostrarEstado(`Delete fail ${jq.status}: ${jq.responseText?.slice(0, 200) || ''}`));
  });

  // --- Obtener single ---
  $(document).on('click', '.product-item', function (e) {
    e.preventDefault();
    const id = $(this).closest('tr').attr('productId');

    $.ajax({
      url: `${BASE}/product-single.php`,
      method: 'POST',
      dataType: 'json',
      data: { id },
    })
      .done((product) => {
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
      })
      .fail((jq) => mostrarEstado(`Single fail ${jq.status}: ${jq.responseText?.slice(0, 200) || ''}`));
  });
});
