const dificultadBtns = document.querySelectorAll('.dificultad-btn');
const intentos = document.querySelector('.intentos');
const puntuaciones = document.querySelector('.puntuaciones');
const reiniciarBtn = document.querySelector('.reiniciar-btn');
const tablero = document.querySelector('.tablero');

let intentosActuales = 0;
let puntuacionesActuales = 0;
let puntuacionesMedio = 0;
let puntuacionesDificil = 0;

let jugadorActual = null;
let cartas = [];

function generarCartas() {
    let cartas = [];
    for (let i = 0; i < 4; i++) {
        cartas.push(Math.floor(Math.random() * 4));
    }
    return cartas;
}


