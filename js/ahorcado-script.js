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
const letras = [...'abcdefghijklmnñopqrstuvwxyz']; // Desestructuración de un string para hacer un array.
let letrasContainer = document.querySelector(".letras");

//Generar letras en HTML
letras.forEach(letra => {
  let span = document.createElement("span");
  let spanText = document.createTextNode(letra);
  span.appendChild(spanText);
  span.className = "letter-box";

  letrasContainer.appendChild(span);
});

//Palabras a usarse en el juego, la lógica del juego no permite elementos como frases, netamente PALABRAS.
const palabras = {
  Programación: ["php", "javascript", "golang", "scala", "fortran", "r", "mysql", "python"],
  Películas: ["Eter", "Splice", "Parasite", "Interstellar", "Terminator", "Alien", "Coco", "Siniestro"],
  Personas: ["Einstein", "Lejeune", "Lemaitre", "Jesucristo", "Ghandi", "Tolkien", "Chesterton", "Newton", "Copernico", "Ockham"],
  Paises: ["Algeria", "Siria", "Palestina", "Yemen", "Egipto", "Oman", "Qatar", "Peru", "Polonia", "Portugal", "Italia"]
}
let arrayCategorias = Object.keys(palabras); //obtiene los valores: Programación", "Películas", "Personas", "Paises, en array.

//Para obtener una llave/categoría random/aleatoria
let posiciónCategoriaRandom = Math.floor(Math.random() * arrayCategorias.length), //con Math.floor se obtiene un ńumero entero, sino sale en decimales
  nombreCategoriaRandom = arrayCategorias[posiciónCategoriaRandom],
  arrayPalabrasCategoria = palabras[nombreCategoriaRandom],
  //Para obtener un valor random
  posicionPalabraRandom = Math.floor(Math.random() * arrayPalabrasCategoria.length),
  palabraRandom = arrayPalabrasCategoria[posicionPalabraRandom];

//Muestra la categoría a la que pertenece la palabra
document.querySelector(".row .pista span").innerHTML = nombreCategoriaRandom;

let palabraHtml = document.querySelector(".palabra");
let arrayLetrasPalabra = Array.from(palabraRandom.toLowerCase()); //Array de las letras de la palabra a adivinar.
arrayLetrasPalabra.forEach((a) => { //por cada elemento del array
  let span = document.createElement("span"); //se crea un span
  if (a === " ") { //si el elemento es igual a un espacio en blanco
    span.className = "with-space"; //se agrega esta clase al elemento html que tiene cierto diseño en CSS
  }
  palabraHtml.appendChild(span);//añade un span por cada letra de la palabra
});

//Spans para las letras de la palabra a adivinar
let spanPalabraHtml = document.querySelectorAll(".palabra span");
//Contar intentos incorrectos
let intentosIncorrectos = 0;

//Contar letras acertadad
let letrasAcertadas = 0;

//Manejo del juego haciendo clic en las letras
document.addEventListener("click", (e) => {
  let esElegido = false; //estado de la letra de la palabra a adivinar, se debe mostrar o no
  if (e.target.className === "letter-box") {
    e.target.classList.add("clicked");
    let letraSeleccionada = e.target.innerHTML.toLowerCase();
    arrayLetrasPalabra.forEach((letraPalabra, indiceLetra) => {
      if (letraSeleccionada == letraPalabra) {
        letrasAcertadas++;
        esElegido = true; //Si la letra es igual a alguna que está en la palabra, aparece.
        spanPalabraHtml.forEach((span, indiceSpan) => {
          if (indiceLetra === indiceSpan) {
            span.innerHTML = letraPalabra;
          }
        });
      }
    })
    if (letrasAcertadas == arrayLetrasPalabra.length) {
      alert("¡Felicidades, GANASTE!. ¿DESEAS JUGAR NUEVAMENTE?");
      if (alert) {
        window.location.reload();
      }
    }
    if (esElegido !== true) {
      intentosIncorrectos++;
      dibujarAhorcado();
      if (intentosIncorrectos == hangman.length) {
        letrasContainer.classList.add("finished");
        perdioPartida();
      }
    }
    esElegido = false;
  }
});

function perdioPartida() {
  palabraRandom = palabraRandom.toUpperCase();
  alert(`PERDISTE. La palabra era: "${palabraRandom}". ¿DESEAS JUGAR NUEVAMENTE?`);
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
  let lineasAhorcado = document.querySelector('.hangman').querySelectorAll('svg');
  for (let i = 0; i < lineasAhorcado.length; i++) {
    lineasAhorcado[i].children[0].classList.remove('draw');
  }
  let svg;
  if (part.circle == undefined) {
    svg = '<svg><line class="draw" x1="' + part.from[0] + '%" y1="' + part.from[1] + '%" x2="' + part.to[0] + '%" y2="' + part.to[1] + '%"/></svg>';
  } else {
    svg = '<svg><circle class="draw" cx="' + part.circle[0] + '%" cy="' + part.circle[1] + '%" r="' + part.radius + '%"/></svg>';
  }

  document.querySelector('.hangman').innerHTML += svg;
}