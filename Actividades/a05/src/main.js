
function getDatos()
{
    var nombre = prompt("Nombre: ", "");

    var edad = prompt("Edad: ", 0);

    var div1 = document.getElementById('nombre');
    div1.innerHTML = '<h3> Nombre: '+nombre+'</h3>';

    var div2 = document.getElementById('edad');
    div2.innerHTML = '<h3> Edad: '+edad+'</h3>';
}

function holaMundo(){
    var holaMundo = "Hola Mundo";
    var div3 = document.getElementById('hola Mundo');
    div3.innerHTML = '<h3>Hola Mundo</h3>';
}

function variablesV(){
    var nombre = "Juan";
    var edad = 10;
    var altura = 1.92;
    var casado = false;

    var div4 = document.getElementById("nombre");
    var div5 = document.getElementById("edad");
    var div6 = document.getElementById("altura");
    var div7 = document.getElementById("casado");
    div4.innerHTML = '<h3> Nombre: '+nombre+'</h3>';
    div5.innerHTML = '<h3> Edad: '+edad+'</h3>';
    div6.innerHTML = '<h3> Altura: '+altura+'</h3>';
    div7.innerHTML = '<h3> Casado: '+casado+'</h3>';
}


function nombreEdad(){
    var nombre = prompt("Ingresa tu nombre: ", "");
    var edad = prompt("Ingresa tu edad: ", 0);

    var div1 = document.getElementById("hola");
    var div2 = document.getElementById("anios");

    div1.innerHTML = '<h3> Hola '+nombre+' asi que tienes '+edad+' años</h3>';
}


function suma(){
    var valor1;
    var valor2;
    valor1 = prompt("Introducir primer número:", "");
    valor2 = prompt("Introducir segundo número", "");
    var suma = parseInt(valor1)+parseInt(valor2);
    var producto = parseInt(valor1)*parseInt(valor2);

    var div1 = document.getElementById("suma");
    var div2 = document.getElementById("resta");

    div1.innerHTML = '<h3> La suma es '+suma+'</h3>';
    div2.innerHTML = '<h3> El producto es '+producto+'</h3>';    
}

function sentenciaIf(){
    var nombre;
    var nota;
    var div1 = document.getElementById("calificacion");
    nombre = prompt("Ingresa tu nombre:", "");
    nota = prompt("Ingresa tu nota:", "");

    if (nota>=4 && nota<=10) {
    div1.innerHTML='<h3> '+nombre+' esta aprobado con una nota '+nota+'</h3>';    
}
}

function ejercicio6(){
    var num1 = parseInt(prompt("Número 1: ", 0));
    var num2 = parseInt(prompt("Número 2: ", 0));

    if (num1 > num2){
        var div = document.getElementById('ejer6');
        div.innerHTML = '<h3> Entre '+num1+' y '+num2+', el mayor es: '+num1+'</h3>';
    }else{
        var div = document.getElementById('ejer6');
        div.innerHTML = '<h3> Entre '+num1+' y '+num2+', el mayor es: '+num2+'</h3>';
    }
}

function ejercicio7(){
    var nota1 = parseInt(prompt("Nota 1: ", 0));
    var nota2 = parseInt(prompt("Nota 2: ", 0));
    var nota3 = parseInt(prompt("Nota 3: ", 0));

    pro=(nota1 + nota2 + nota3) / 3;

    if (pro >= 7) {
        var div = document.getElementById('ejer7');
        div.innerHTML = '<h3> Aprobado :D </h3>';
    } else {
        if (pro >= 4) {
            var div = document.getElementById('ejer7');
            div.innerHTML = '<h3> Promedio Regular </h3>';
        } else {
            var div = document.getElementById('ejer7');
            div.innerHTML = '<h3> Reprobado :( </h3>';
        }
    }
}

function ejercicio8(){
    var valor = parseInt(prompt("Ingresar un valor comprendido entre 1 y 5:", ""));
    switch(valor) {
        case 1:
            var div = document.getElementById('ejer8');
            div.innerHTML = '<h3> El valor ingresado es 1 </h3>';
            break;
        case 2:
            var div = document.getElementById('ejer8');
            div.innerHTML = '<h3> El valor ingresado es 2 </h3>';
            break;
        case 3:
            var div = document.getElementById('ejer8');
            div.innerHTML = '<h3> El valor ingresado es 3 </h3>';
            break;  
        case 4:
            var div = document.getElementById('ejer8');
            div.innerHTML = '<h3> El valor ingresado es 4 </h3>';
            break;
        case 5:
            var div = document.getElementById('ejer8');
            div.innerHTML = '<h3> El valor ingresado es 5 </h3>';
            break;
        default:
            var div = document.getElementById('ejer8');
            div.innerHTML = '<h3> El valor ingresado no está comprendido entre 1 y 5 </h3>';
    }
}

function ejercicio9(){
    var color = prompt("Ingrese el color del que quiera pintar el fondo de la ventana (rojo, verde, azul):", "").toLowerCase();
    switch(color) {
        case 'rojo':
            document.body.style.backgroundColor = '#ff0000';
            break;
        case 'verde':
            document.body.style.backgroundColor = '#00ff00';
            break;
        case 'azul':
            document.body.style.backgroundColor = '#0000ff';
            break;
        default:
            alert("Color no válido");
    }
}
function ejercicio10(){
    var x=1;
    while (x <= 100) {
        var div = document.getElementById('ejer10');
        div.innerHTML += '<span> '+x+' </span>';
        x++;
    }
}

function ejercicio11(){
    var suma = 0;
    var x = 1;
    while (x <= 5) {
        var valor = parseInt(prompt("Ingresa un valor:", ""));
        suma += valor;
        x++;
    }
    var div = document.getElementById('ejer11');
    div.innerHTML = '<h3> La suma de los valores es: '+suma+'</h3>';
}

function ejercicio12(){
    var suma = 0;
    var x = 1;
    do {
        var valor = parseInt(prompt("Ingresa un valor entre 0 y 999:", ""));
        var div = document.getElementById('ejer12');
        div.innerHTML += '<h3> El valor '+valor+' tiene ';
        if (valor<10) {
            div.innerHTML += '1 dígito</h3>';
        }
        else{
            if (valor<100) {
                div.innerHTML += '2 dígitos</h3>';
            }
            else{
                div.innerHTML += '3 dígitos</h3>';
            }
        }
    } while (valor!=0);
}

function ejercicio13(){
    var f;
    for (f = 1; f <= 10; f++) {
        var div = document.getElementById('ejer13');
        div.innerHTML += '<span>'+f+' </span>';   
    }
}

function ejercicio14(){
    var div = document.getElementById('ejer14');
    for (var i = 1; i <= 3; i++) {
        div.innerHTML += '<h3> Cuidado</h3>';
        div.innerHTML += '<h3> Ingresa tu documento correctamente</h3>';
    }
}

function mensaje(){
    var div = document.getElementById('ejer15');
    div.innerHTML += '<h3> Cuidado </h3>';
    div.innerHTML += '<h3> Ingresa tu documento correctamente </h3>';
}

function ejercicio15(){
    for (var i = 1; i <= 3; i++) {
        mensaje();  
    }
}

function mostrarRango(x1, x2){
    var inicio;
    var div = document.getElementById('ejer16');
    for(inicio = x1; inicio <= x2; inicio++) {
        div.innerHTML += '<span> '+inicio+' </span>';  
    }
}

function ejercicio16(){
    var valor1, valor2;
    valor1 = parseInt(prompt("Ingrese el valor inferior:", ""));
    valor2 = parseInt(prompt("Ingrese el valor superior:", ""));
    mostrarRango(valor1, valor2);
}

function convertirCastellano(x){
    var div = document.getElementById('ejer17');
    if (x == 1) {
        div.innerHTML = '<h3> Uno </h3>';
    } else{
        if(x == 2) {
            div.innerHTML = '<h3> Dos </h3>';
        }else{
            if(x == 3) {
                div.innerHTML = '<h3> Tres </h3>';
            }else{
                if(x == 4) {
                    div.innerHTML = '<h3> Cuatro </h3>';
                }else{
                    if(x == 5) {
                        div.innerHTML = '<h3> Cinco </h3>';
                    }else{
                        div.innerHTML = '<h3> Valor incorrecto </h3>';
                    }
                }
            }
        }
    }
}

function ejercicio17(){
    var valor;
    valor = parseInt(prompt("Ingrese un valor entre 1 y 5:", ""));
    convertirCastellano(valor);
}

function convertirACastellano(x){
    var div = document.getElementById('ejer18');
    switch(x) {
        case 1: div.innerHTML = '<h3> Uno </h3>'; break;
        case 2: div.innerHTML = '<h3> Dos </h3>'; break;
        case 3: div.innerHTML = '<h3> Tres </h3>'; break;
        case 4: div.innerHTML = '<h3> Cuatro </h3>'; break;
        case 5: div.innerHTML = '<h3> Cinco </h3>'; break;
        default: div.innerHTML = '<h3> Valor incorrecto </h3>'; break;
    }
}

function ejercicio18(){
    var valor;
    valor = parseInt(prompt("Ingrese un valor entre 1 y 5:", ""));
    convertirACastellano(valor);
}