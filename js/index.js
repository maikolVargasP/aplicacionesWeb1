document.addEventListener('DOMContentLoaded', () => {
    // Aquí va todo el código que te pasé antes
    let tareas = [];

    const inputFecha = document.getElementById('fecha-tarea');
    const inputDescripcion = document.getElementById('descripcion-tarea');
    const botonAgregar = document.getElementById('agregar-tarea');
    const listaPendientes = document.getElementById('lista-pendientes');
    const totalTareas = document.getElementById('total-tareas');
    const pendientesTareas = document.getElementById('pendientes-tareas');
    const completadasTareas = document.getElementById('completadas-tareas');

    function actualizarContadores() {
        totalTareas.textContent = tareas.length;
        const pendientes = tareas.filter(t => t.estado === 'pendiente').length;
        const completadas = tareas.filter(t => t.estado === 'completada').length;
        pendientesTareas.textContent = pendientes;
        completadasTareas.textContent = completadas;
    }

    function mostrarTareasPendientes() {
        listaPendientes.innerHTML = '';
        tareas
            .filter(t => t.estado === 'pendiente')
            .forEach(tarea => {
                const li = document.createElement('li');
                li.textContent = `${tarea.fecha} - ${tarea.descripcion}`;
                listaPendientes.appendChild(li);
            });
    }

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

        mostrarTareasPendientes();
        actualizarContadores();

        inputFecha.value = '';
        inputDescripcion.value = '';
    });
});
