document.addEventListener('DOMContentLoaded', () => {

let tareas = []; // Array de tareas

// Referencias a elementos del DOM
const inputFecha = document.getElementById('fecha-tarea');  
const inputDescripcion = document.getElementById('descripcion-tarea');
const botonAgregar = document.getElementById('agregar-tarea');
const listaPendientes = document.getElementById('lista-pendientes');
const listaCompletadas = document.getElementById('lista-completadas');
const totalTareas = document.getElementById('total-tareas');
const pendientesTareas = document.getElementById('pendientes-tareas');
const completadasTareas = document.getElementById('completadas-tareas');
const inputBuscar = document.getElementById('buscar-tarea');
const filtroEstado = document.getElementById('filtro-estado');


// Actualiza contadores
function actualizarContadores() {
    totalTareas.textContent = tareas.length;
    const pendientes = tareas.filter(t => t.estado === 'pendiente').length;
    const completadas = tareas.filter(t => t.estado === 'completada').length;
    pendientesTareas.textContent = pendientes;
    completadasTareas.textContent = completadas;
}

// Ordena tareas por fecha ascendente
function ordenarTareasPorFecha(arr) {
    return arr.slice().sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
}

// Renderiza las listas de tareas (pendientes y completadas) con botones y estilos
function mostrarTareas() {
    // Filtrar según búsqueda y estado
    const textoBuscar = inputBuscar.value.toLowerCase();
    const estadoFiltro = filtroEstado.value;

    // Filtrar tareas según estado
    let tareasFiltradas = tareas.filter(t => {
        if (estadoFiltro === 'pendientes') return t.estado === 'pendiente';
        if (estadoFiltro === 'completadas') return t.estado === 'completada';
        return true; // todas
    });

    // Filtrar por texto de búsqueda en descripción
    tareasFiltradas = tareasFiltradas.filter(t => t.descripcion.toLowerCase().includes(textoBuscar));

    // Separar pendientes y completadas y ordenar por fecha
    const pendientes = ordenarTareasPorFecha(tareasFiltradas.filter(t => t.estado === 'pendiente'));
    const completadas = ordenarTareasPorFecha(tareasFiltradas.filter(t => t.estado === 'completada'));

    // Mostrar pendientes
    listaPendientes.innerHTML = '';
    pendientes.forEach(tarea => {
        const li = document.createElement('li');
        li.classList.add('tarea-pendiente');
        li.innerHTML = `
            <span>${tarea.fecha} - ${tarea.descripcion}</span>
            <button class="btn-completar" data-id="${tarea.id}" title="Marcar como completada">✔</button>
            <button class="btn-eliminar" data-id="${tarea.id}" title="Eliminar tarea">🗑</button>
        `;
        listaPendientes.appendChild(li);
    });

    // Mostrar completadas
    listaCompletadas.innerHTML = '';
    completadas.forEach(tarea => {
        const li = document.createElement('li');
        li.classList.add('tarea-completada');
        li.innerHTML = `
            <span>${tarea.fecha} - ${tarea.descripcion}</span>
            <button class="btn-eliminar" data-id="${tarea.id}" title="Eliminar tarea">🗑</button>
        `;
        listaCompletadas.appendChild(li);
    });

    actualizarContadores();
}

// Agregar tarea
botonAgregar.addEventListener('click', () => {
    const fecha = inputFecha.value;
    const descripcion = inputDescripcion.value.trim();

    if (!fecha) {
        alert('Por favor, ingresa una fecha para la tarea.');
        return;
    }
    if (!descripcion) {
        alert('Por favor, ingresa una descripción para la tarea.');
        return;
    }

    const tarea = {
        id: Date.now(),
        fecha,
        descripcion,
        estado: 'pendiente'
    };

    tareas.push(tarea);

    inputFecha.value = '';
    inputDescripcion.value = '';

    mostrarTareas();
});

// Delegación de eventos para botones completar y eliminar
document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-completar')) {
        const id = Number(e.target.dataset.id);
        const tarea = tareas.find(t => t.id === id);
        if (tarea) {
            tarea.estado = 'completada';
            mostrarTareas();
        }
    }
    if (e.target.classList.contains('btn-eliminar')) {
        const id = Number(e.target.dataset.id);
        tareas = tareas.filter(t => t.id !== id);
        mostrarTareas();
    }
});

// Filtrar tareas al escribir en buscar o cambiar filtro estado
inputBuscar.addEventListener('input', mostrarTareas);
filtroEstado.addEventListener('change', mostrarTareas);

// Mostrar tareas inicial (vacío)
mostrarTareas();
});
