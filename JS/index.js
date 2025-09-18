// Variables del juego
let cartas = [];
let cartasVolteadas = [];
let movimientos = 0;
let paresEncontrados = 0;
let juegoTerminado = false;
let juegoActivo = false;
let dificultad = 'facil';

// Variables para el cronómetro
let tiempoSegundos = 0;
let intervaloTiempo = null;

// Elementos DOM
const tablero = document.querySelector('.tablero');
const contadorIntentos = document.querySelector('.intentos');
const contadorTiempo = document.querySelector('.tiempo');
const botonReiniciar = document.querySelector('.reiniciar-btn');
const botonesDificultad = document.querySelectorAll('.dificultad-btn');
const mensajeGanador = document.querySelector('.mensaje-ganador');
const puntuacionFacil = document.getElementById('puntuacion-facil');
const puntuacionMedio = document.getElementById('puntuacion-medio');
const puntuacionDificil = document.getElementById('puntuacion-dificil');
const botonGuardarPuntuacion = document.getElementById('guardar-puntuacion');
const botonLimpiarPuntuaciones = document.getElementById('limpiar-puntuaciones');

// Configuraciones por dificultad
const configuraciones = {
    'facil': { pares: 6, columnas: 4 },
    'medio': { pares: 8, columnas: 4 },
    'dificil': { pares: 12, columnas: 4 }
};

// Imágenes para las cartas 
const imagenes = [
    'images/equipo1.png',
    'images/equipo2.png',
    'images/equipo3.png',
    'images/equipo4.png',
    'images/equipo5.png',
    'images/equipo6.png',
    'images/equipo7.png',
    'images/equipo8.png',
    'images/equipo9.png',
    'images/equipo10.png',
    'images/equipo11.png',
    'images/equipo12.png',
];

// Precargar imágenes
function precargarImagenes() {
    imagenes.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Función para formatear el tiempo en mm:ss
function formatearTiempo(segundos) {
    const min = Math.floor(segundos / 60).toString().padStart(2, '0');
    const seg = (segundos % 60).toString().padStart(2, '0');
    return `${min}:${seg}`;
}

// Función para iniciar el cronómetro
function iniciarCronometro() {
    tiempoSegundos = 0;
    contadorTiempo.textContent = formatearTiempo(tiempoSegundos);
    if (intervaloTiempo) clearInterval(intervaloTiempo);
    intervaloTiempo = setInterval(() => {
        tiempoSegundos++;
        contadorTiempo.textContent = formatearTiempo(tiempoSegundos);
    }, 1000);
}

// Función para detener el cronómetro
function detenerCronometro() {
    clearInterval(intervaloTiempo);
}

// Inicializar el juego
function inicializarJuego() {
    const config = configuraciones[dificultad];

    // Crear array de cartas (pares)
    cartas = [];
    for (let i = 0; i < config.pares; i++) {
        cartas.push(i);
        cartas.push(i);
    }

    // Barajar cartas
    cartas = cartas.sort(() => Math.random() - 0.5);

    // Crear el tablero
    tablero.innerHTML = '';
    tablero.style.gridTemplateColumns = `repeat(${config.columnas}, 1fr)`;

    cartas.forEach((valor, indice) => {
        const carta = document.createElement('div');
        carta.className = 'carta';
        carta.dataset.valor = valor;
        carta.dataset.indice = indice;

        // Parte frontal
        const front = document.createElement('div');
        front.className = 'front';
        front.innerHTML = '<i class="fas fa-question"></i>';

        // Parte trasera
        const back = document.createElement('div');
        back.className = 'back';

        const img = document.createElement('img');
        img.src = imagenes[valor];
        img.alt = `Equipo ${valor + 1}`;

        back.appendChild(img);

        carta.appendChild(front);
        carta.appendChild(back);

        carta.addEventListener('click', () => voltearCarta(carta));
        tablero.appendChild(carta);
    });

    // Reiniciar variables
    movimientos = 0;
    paresEncontrados = 0;
    juegoTerminado = false;
    juegoActivo = true;
    cartasVolteadas = [];

    // Actualizar UI
    contadorIntentos.textContent = movimientos;
    mensajeGanador.style.display = 'none';

    // Iniciar cronómetro
    iniciarCronometro();
}

// Voltear una carta
function voltearCarta(carta) {
    if (!juegoActivo || juegoTerminado || cartasVolteadas.length >= 2 ||
        carta.classList.contains('volteada') ||
        carta.classList.contains('encontrada')) {
        return;
    }

    carta.classList.add('volteada');
    cartasVolteadas.push(carta);

    if (cartasVolteadas.length === 2) {
        movimientos++;
        contadorIntentos.textContent = movimientos;

        // Comprobar si son pareja
        if (cartasVolteadas[0].dataset.valor === cartasVolteadas[1].dataset.valor) {
            // Son pareja
            cartasVolteadas.forEach(c => {
                c.classList.add('encontrada');
            });
            paresEncontrados++;

            cartasVolteadas = [];

            // Comprobar si el juego ha terminado
            if (paresEncontrados === configuraciones[dificultad].pares) {
                juegoTerminado = true;
                juegoActivo = false;
                detenerCronometro();
                setTimeout(() => {
                    mensajeGanador.style.display = 'block';
                    verificarRecord();
                }, 500);
            }
        } else {
            // No son pareja, voltear de nuevo después de un breve tiempo
            juegoActivo = false;
            setTimeout(() => {
                cartasVolteadas.forEach(c => {
                    c.classList.remove('volteada');
                });
                cartasVolteadas = [];
                juegoActivo = true;
            }, 1000);
        }
    }
}

// Cambiar dificultad
botonesDificultad.forEach(boton => {
    boton.addEventListener('click', function () {
        // Remover clase activo de todos los botones
        botonesDificultad.forEach(b => b.classList.remove('activo'));

        // Añadir clase activo al botón clickeado
        this.classList.add('activo');

        // Actualizar dificultad
        if (this.classList.contains('facil')) {
            dificultad = 'facil';
        } else if (this.classList.contains('medio')) {
            dificultad = 'medio';
        } else if (this.classList.contains('dificil')) {
            dificultad = 'dificil';
        }

        // Reiniciar juego con nueva dificultad
        inicializarJuego();
    });
});
// Reiniciar juego
botonReiniciar.addEventListener('click', inicializarJuego);

// Precargar imágenes e iniciar el juego
precargarImagenes();
inicializarJuego(); 