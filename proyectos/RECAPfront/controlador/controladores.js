const API_BASE_URL = 'http://localhost:8080';
let selectedRowId = null;
let controladorData = [];
let currentSortColumn = null;
let isAscending = true;

// Function to load and display controlador with cantidad de controladores
function loadAndDisplaycontrolador() {
    axios.get(`${API_BASE_URL}/controladores`)
        .then(response => {
            controladorData = response.data;
            const controladoresPromises = controladorData.map(controlador =>
                axios.get(`${API_BASE_URL}/controladores/${controlador.idControlador}/contratos`)
            );

            Promise.all(controladoresPromises)
                .then(controladoresResponses => {
                    controladoresResponses.forEach((res, index) => {
                        controladorData[index].contratos = res.data;
                    });
                    displaycontrolador(controladorData);
                })
                .catch(error => console.error('Error al obtener cantidad de contratos', error));
        })
        .catch(error => console.error('Error al cargar controlador', error));
}

// Function to display controlador in the table
function displaycontrolador(controlador) {
    const tableBody = document.getElementById('controladorTableBody');
    tableBody.innerHTML = '';
    controlador.forEach(controlador => {
        tableBody.innerHTML += `
            <tr data-id="${controlador.idcontrolador}" onclick="handleRowClick(event, ${controlador.idControlador})">
                <td>${controlador.idControlador}</td>
                <td>${controlador.nombre}</td>
                <td>${controlador.apellido}</td>
                <td>${controlador.dni}</td>
                <td>${controlador.numHabilitacion}</td>
                <td>${controlador.contratos}</td>
            </tr>
        `;
    });
}

// Function to handle row click
function handleRowClick(event, id) {
    // Deselect previously selected row
    document.querySelectorAll('#controladorTableBody tr').forEach(row => row.classList.remove('selected'));
    
    // Select the clicked row
    const row = event.currentTarget;
    row.classList.add('selected');
    selectedRowId = id;
    
    toggleActionButtons(true);
}

// Function to toggle action buttons
function toggleActionButtons(enabled) {
    document.getElementById('editBtn').disabled = !enabled;
    document.getElementById('deleteBtn').disabled = !enabled;
    document.getElementById('copyBtn').disabled = !enabled;
}

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const dni = document.getElementById('dni').value;
    const numHabilitacion = document.getElementById('numHabilitacion').value;

    axios.post(`${API_BASE_URL}/controladores`, { nombre, apellido, dni, numHabilitacion })
        .then(response => {
            loadAndDisplaycontrolador();
            document.getElementById('controladorForm').reset();
        })
        .catch(error => console.error('Error al agregar controlador', error));
}

// Function to handle edit
function editcontrolador() {
    if (selectedRowId) {
        axios.get(`${API_BASE_URL}/controladores/${selectedRowId}`)
            .then(response => {
                const controlador = response.data;
                const nombre = prompt('Nuevo nombre del controlador:', controlador.nombre);
                const apellido = prompt('Nuevo apellido:', controlador.apellido);
                const dni = prompt('Nuevo DNI:', controlador.dni);
                const numHabilitacion = prompt('Nuevo numero de habilitacion:', controlador.numHabilitacion);

                if (nombre && apellido && dni && numHabilitacion) {
                    axios.put(`${API_BASE_URL}/controladores/${selectedRowId}`, {
                        idcontrolador: selectedRowId,
                        nombre,
                        apellido,
                        dni,
                        numHabilitacion
                    })
                    .then(response => loadAndDisplaycontrolador())
                    .catch(error => console.error('Error al editar controlador', error));
                }
            })
            .catch(error => console.error('Error al obtener datos de la controlador', error));
    }
}

// Function to handle delete
function deletecontrolador() {
    if (selectedRowId && confirm('¿Estás seguro de que quieres eliminar este controlador?')) {
        axios.delete(`${API_BASE_URL}/controladores/${selectedRowId}`)
            .then(response => loadAndDisplaycontrolador())
            .catch(error => console.error('Error al eliminar controlador', error));
    }
}

// Function to handle copy
function copycontrolador() {
    if (selectedRowId) {
        axios.get(`${API_BASE_URL}/controlador/${selectedRowId}`)
            .then(response => {
                const controlador = response.data;
                const copyText = `ID: ${controlador.idcontrolador}\nNombre: ${controlador.nombre}\nResolución: ${controlador.apellido}\nSocio 1: ${controlador.DNI}\nSocio 2: ${controlador.NumHabilitacion}`;
                navigator.clipboard.writeText(copyText)
                    .then(() => alert('controlador copiada al portapapeles'))
                    .catch(error => console.error('Error al copiar controlador', error));
            })
            .catch(error => console.error('Error al obtener datos de la controlador', error));
    }
}

// Function to sort table

function sortTable(column) {
    // Si se hace clic en la misma columna, alternar entre ascendente y descendente
    if (currentSortColumn === column) {
        isAscending = !isAscending;
    } else {
        currentSortColumn = column;
        isAscending = true;
    }

    const sortedData = [...controladorData].sort((a, b) => {
        if (a[column] < b[column]) return isAscending ? -1 : 1;
        if (a[column] > b[column]) return isAscending ? 1 : -1;
        return 0;
    });
    displaycontrolador(sortedData);
}

// Function to toggle sticky form
function toggleStickyForm() {
    const form = document.getElementById('controladorForm');
    const header = document.getElementById('addcontroladorHeader');
    if (form.classList.contains('sticky')) {
        form.classList.remove('sticky');
        header.classList.remove('sticky');
    } else {
        form.classList.add('sticky');
        header.classList.add('sticky');
    }
}

// Event listeners
document.getElementById('controladorForm').addEventListener('submit', handleFormSubmit);
document.getElementById('editBtn').addEventListener('click', editcontrolador);
document.getElementById('deleteBtn').addEventListener('click', deletecontrolador);
document.getElementById('copyBtn').addEventListener('click', copycontrolador);
document.getElementById('toggleFormBtn').addEventListener('click', toggleStickyForm);

// Initial load
loadAndDisplaycontrolador();