/*No es responsive, si la palabra a adivinar es grande, todo se verà de acuerdo a su longitud. Evitar palabras largas.*/
"use strict";

//Para el dibujo del ahorcado:
var hangman = [
  { from: [70, 38], to: [72, 46] },
  { from: [70, 38], to: [68, 46] },
  { from: [70, 45], to: [72, 55] },
  { from: [70, 45], to: [68, 55] },
  { from: [70, 35], to: [70, 45] },
  { circle: [70, 30], radius: 2 },
  { from: [70, 5], to: [70, 25] },
  { from: [30, 5], to: [70, 5] },
  { from: [30, 95], to: [30, 5] },
  { from: [1, 95], to: [99, 95] }
];

//Letras  (teclado en pantalla)
const letras = "abcdefghijklmnñopqrstuvwxyz";
const letras_array = Array.from(letras);
let letras_container = document.querySelector(".letras");

//Generar letras en HTML
letras_array.forEach(letra => {
  let span = document.createElement("span");
  let spanText = document.createTextNode(letra);
  span.appendChild(spanText);
  span.className = "letter-box";

  letras_container.appendChild(span);
});

//Palabras a usarse en el juego, la lógica del juego no permite elementos como frases, netamente PALABRAS.
const palabras = {
  Programación: ["php", "javascript", "golang", "scala", "fortran", "r", "mysql", "python"],
  Películas: ["Eter", "Splice", "Parasite", "Interstellar", "Terminator", "Alien", "Coco", "Siniestro"],
  Personas: ["Einstein", "Lejeune", "Lemaitre", "Jesucristo", "Ghandi", "Tolkien", "Chesterton", "Newton", "Copernico", "Ockham"],
  Paises: ["Algeria", "Siria", "Palestina", "Yemen", "Egipto", "Oman", "Qatar", "Peru", "Polonia", "Portugal", "Italia"]
}
let array_categorias = Object.keys(palabras); //obtiene los valores: Programación", "Películas", "Personas", "Paises, en array.

//Para obtener una llave/categoría random/aleatoria
let posición_categoria_random = Math.floor(Math.random() * array_categorias.length), //con Math.floor se obtiene un ńumero entero, sino sale en decimales
  nombre_categoria_random = array_categorias[posición_categoria_random],
  array_palabras_categoria = palabras[nombre_categoria_random],
  //Para obtener un valor random
  posicion_palabra_random = Math.floor(Math.random() * array_palabras_categoria.length),
  palabra_random = array_palabras_categoria[posicion_palabra_random];

//Muestra la categoría a la que pertenece la palabra
document.querySelector(".row .pista span").innerHTML = nombre_categoria_random;

let palabra_html = document.querySelector(".palabra");
let array_letras_palabra = Array.from(palabra_random.toLowerCase()); //Array de las letras de la palabra a adivinar.
array_letras_palabra.forEach((a) => { //por cada elemento del array
  let span = document.createElement("span"); //se crea un span
  if (a === " ") { //si el elemento es igual a un espacio en blanco
    span.className = "with-space"; //se agrega esta clase al elemento html que tiene cierto diseño en CSS
  }
  palabra_html.appendChild(span);//añade un span por cada letra de la palabra
});

//Spans para las letras de la palabra a adivinar
let span_palabra_html = document.querySelectorAll(".palabra span");
//Contar intentos incorrectos
let intentos_incorrectos = 0;

//Contar letras acertadad
let letras_acertadas = 0;

//Manejo del juego haciendo clic en las letras
document.addEventListener("click", (e) => {
  let es_elegido = false; //estado de la letra de la palabra a adivinar, se debe mostrar o no
  if (e.target.className === "letter-box") {
    e.target.classList.add("clicked");
    let letra_seleccionada = e.target.innerHTML.toLowerCase();
    array_letras_palabra.forEach((letra_palabra, indice_letra) => {
      if (letra_seleccionada == letra_palabra) {
        letras_acertadas++;
        es_elegido = true; //Si la letra es igual a alguna que está en la palabra, aparece.
        span_palabra_html.forEach((span, indice_span) => {
          if (indice_letra === indice_span) {
            span.innerHTML = letra_palabra;
          }
        });
      }
    })
    if (letras_acertadas == array_letras_palabra.length) {
      alert("¡Felicidades, GANASTE!. ¿DESEAS JUGAR NUEVAMENTE?");
      if (alert) {
        window.location.reload();
      }
    }
    if (es_elegido !== true) {
      intentos_incorrectos++;
      dibujarAhorcado();
      if (intentos_incorrectos == hangman.length) {
        letras_container.classList.add("finished");
        perdioPartida();
      }
    }
    es_elegido = false;
  }
});

function perdioPartida() {
  palabra_random = palabra_random.toUpperCase();
  alert(`PERDISTE. La palabra era: "${palabra_random}". ¿DESEAS JUGAR NUEVAMENTE?`);
  if (alert) {
    window.location.reload();
  }
}

//Intentos, con esto trabajará la función para dibujar al ahorcado
let intentos = hangman.length;
//Función para dibujar al ahorcado
function dibujarAhorcado() {
  intentos--;
  let part = hangman[intentos];
  let lineas_ahorcado = document.querySelector('.hangman').querySelectorAll('svg');
  for (let i = 0; i < lineas_ahorcado.length; i++) {
    lineas_ahorcado[i].children[0].classList.remove('draw');
  }
  let svg;
  if (part.circle == undefined) {
    svg = '<svg><line class="draw" x1="' + part.from[0] + '%" y1="' + part.from[1] + '%" x2="' + part.to[0] + '%" y2="' + part.to[1] + '%"/></svg>';
  } else {
    svg = '<svg><circle class="draw" cx="' + part.circle[0] + '%" cy="' + part.circle[1] + '%" r="' + part.radius + '%"/></svg>';
  }

  document.querySelector('.hangman').innerHTML += svg;
}