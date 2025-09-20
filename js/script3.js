const wordContainer = document.getElementById('wordContainer');
const startButton = document.getElementById('startButton');
const usedLettersElement = document.getElementById('usedLetters');
const returnButton = document.getElementById('returnButton');
const categorySelect = document.getElementById('categorySelect');
const categoryDisplayElement = document.getElementById('categoryDisplay');
const myImageElement = document.getElementById('desaparecerimg');
const statsContainer = document.getElementById('statsContainer');
const statsDisplay = document.getElementById('statsDisplay');
const historyDisplay = document.getElementById('historyDisplay');
const historyButton = document.getElementById('historyButton');
const returnFromHistoryButton = document.getElementById('returnFromHistoryButton');
const gameScreen = document.getElementById('gameScreen');
const menuContainer = document.getElementById('menuContainer'); // Añade esta línea

// Configuración del canvas para el ahorcado
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.canvas.width = 0;
ctx.canvas.height = 0;

// Coordenadas de las partes del cuerpo a dibujar
const bodyParts = [
    [4, 2, 1, 1],
    [4, 3, 1, 2],
    [3, 5, 1, 1],
    [5, 5, 1, 1],
    [3, 3, 1, 1],
    [5, 3, 1, 1],
];

let selectedWord;
let usedLetters;
let mistakes;
let hits;

// Selecciona una palabra al azar de la categoría elegida
const selectedRandomWord = (category) => {
    let word = categories[category][Math.floor(Math.random() * categories[category].length)];
    selectedWord = word.split('');
};

// Dibuja una parte del cuerpo en el canvas
const addBodyPart = (bodyPart) => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(...bodyPart);
};
// Agrega la letra al contenedor de letras usadas
const addLetter = (letter) => {
    const letterElement = document.createElement('span');
    letterElement.textContent = letter.toUpperCase();
    usedLettersElement.appendChild(letterElement);
};
// Gestiona una letra incorrecta y dibuja una parte del cuerpo
const wrongLetter = () => {
    addBodyPart(bodyParts[mistakes]);
    mistakes++;
    if (mistakes === bodyParts.length) endGame();
};
// Actualiza el contador de victorias y derrotas
const updateScore = (result) => {
    let stats = JSON.parse(localStorage.getItem('stats')) || { wins: 0, losses: 0 };
    if (result === 'Victoria') stats.wins++;
    else stats.losses++;
    localStorage.setItem('stats', JSON.stringify(stats));
};
// Revela la letra si es correcta y verifica si el juego ha terminado
const correctLetter = (letter) => {
    const { children } = wordContainer;

    for (let i = 0; i < children.length; i++) {
        if (children[i].innerHTML === letter) {
            children[i].classList.remove('hidden');
            hits++;
        }
    }

    if (hits === selectedWord.length) endGame();
};
// Procesa la letra ingresada por el usuario
const letterInput = (letter) => {
    if (selectedWord.includes(letter)) {
        correctLetter(letter);
    } else {
        wrongLetter();
    }
    addLetter(letter);
    usedLetters.push(letter);
};
// Maneja los eventos de teclado
const letterEvent = (event) => {
    let newLetter = event.key.toUpperCase();

    if (newLetter.match(/^[A-ZÑ]$/) && !usedLetters.includes(newLetter)) {
        letterInput(newLetter);
    }
};
// Dibuja los espacios de la palabra en la pantalla
const drawWord = () => {
    selectedWord.forEach((letter) => {
        const letterElement = document.createElement('span');
        letterElement.innerHTML = letter.toUpperCase();
        letterElement.classList.add('letter', 'hidden');
        wordContainer.appendChild(letterElement);
    });
};

// Dibuja la horca inicial en el canvas
const drawHangMan = () => {
    ctx.canvas.width = 120;
    ctx.canvas.height = 160;
    ctx.scale(20, 20);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#d95d39';
    ctx.fillRect(0, 7, 4, 1);
    ctx.fillRect(1, 0, 1, 8);
    ctx.fillRect(2, 0, 3, 1);
    ctx.fillRect(4, 1, 1, 1);
};

const startGame = () => {
    usedLetters = [];
    mistakes = 0;
    hits = 0;

    // Oculta los elementos de la pantalla de inicio
    menuContainer.classList.add('ocultar');
    myImageElement.classList.add('ocultar');
    
    // Muestra la pantalla de juego
    gameScreen.classList.remove('ocultar');
    categoryDisplayElement.classList.remove('ocultar');

    drawHangMan();
    const category = categorySelect.value;
    categoryDisplayElement.textContent = `Categoría: ${category.toUpperCase()}`;
    
    selectedRandomWord(category);
    drawWord();
    document.addEventListener('keydown', letterEvent);
};
// Termina el juego y guarda el resultado
const endGame = () => {
    document.removeEventListener('keydown', letterEvent);
    returnButton.classList.remove('ocultar');
    
    const result = (hits === selectedWord.length) ? 'Victoria' : 'Derrota';
    saveHistory(result);
    updateScore(result);
};
// Vuelve a la pantalla del menú principal
const returnToMenu = () => {
    gameScreen.classList.add('ocultar');
    returnButton.classList.add('ocultar');
    
    // Muestra la pantalla de inicio
    menuContainer.classList.remove('ocultar');
    myImageElement.classList.remove('ocultar');
    
    wordContainer.innerHTML = '';
    usedLettersElement.innerHTML = '';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};
// Muestra la pantalla del historial
const showHistoryScreen = () => {
    // Oculta todos los demás elementos
    menuContainer.classList.add('ocultar');
    myImageElement.classList.add('ocultar');
    gameScreen.classList.add('ocultar');
    
    // Muestra la pantalla de historial
    statsContainer.classList.remove('ocultar');
    showHistory();
};
// Vuelve del historial al menú principal
const returnFromHistory = () => {
    // Oculta la pantalla de historial
    statsContainer.classList.add('ocultar');
    
    // Muestra la pantalla de inicio
    menuContainer.classList.remove('ocultar');
    myImageElement.classList.remove('ocultar');
};
// Muestra las estadísticas y el historial en la pantalla
const showHistory = () => {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    const stats = JSON.parse(localStorage.getItem('stats')) || { wins: 0, losses: 0 };

    statsDisplay.textContent = `Victorias: ${stats.wins} | Derrotas: ${stats.losses}`;
    historyDisplay.innerHTML = '';
    
    history.forEach((game) => {
        const gameItem = document.createElement('p');
        gameItem.textContent = `Palabra: ${game.word}, Resultado: ${game.result}, Fecha: ${game.date}`;
        historyDisplay.appendChild(gameItem);
    });
};


startButton.addEventListener('click', startGame);
returnButton.addEventListener('click', returnToMenu);
historyButton.addEventListener('click', showHistoryScreen);
returnFromHistoryButton.addEventListener('click', returnFromHistory);