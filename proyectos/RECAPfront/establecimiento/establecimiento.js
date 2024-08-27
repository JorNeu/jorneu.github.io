const API_BASE_URL = 'http://localhost:8080';
let selectedRowId = null;
let establecimientosData = [];
let currentSortColumn = null;
let isAscending = true;
// Function to load and display establecimientos
function loadAndDisplayEstablecimientos() {
    axios.get(`${API_BASE_URL}/establecimientos`)
        .then(response => {
            establecimientosData = response.data;
            displayEstablecimientos(establecimientosData);
        })
        .catch(error => console.error('Error loading establecimientos:', error));
}

// Function to display establecimientos in the table
function displayEstablecimientos(establecimientos) {
    const tableBody = document.getElementById('establecimientosTableBody');
    tableBody.innerHTML = '';
    establecimientos.forEach(establecimiento => {
        tableBody.innerHTML += `
            <tr data-id="${establecimiento.idEstablecimiento}" onclick="handleRowClick(event, ${establecimiento.idEstablecimiento})">
                <td>${establecimiento.idEstablecimiento}</td>
                <td>${establecimiento.nombre}</td>
                <td>${establecimiento.razonSocial}</td>
                <td>${establecimiento.direccion}</td>
                <td>${establecimiento.factorOcupacional !== undefined ? establecimiento.factorOcupacional : ''}</td>
                <td>${establecimiento.habilitacion ? 'Sí' : 'No'}</td>
            </tr>
        `;
    });
}

// Function to handle row click
function handleRowClick(event, id) {
    // Deselect previously selected row
    document.querySelectorAll('#establecimientosTableBody tr').forEach(row => row.classList.remove('selected'));

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

    const nombre = document.getElementById('nombreEstablecimiento').value;
    const razonSocial = document.getElementById('razonSocialEstablecimiento').value;
    const direccion = document.getElementById('direccionEstablecimiento').value;
    
    const factorOcupacional = document.getElementById('factorOcupacionalEstablecimiento').value;
    const habilitacion = document.getElementById('habilitacionEstablecimiento').checked;

    axios.post(`${API_BASE_URL}/establecimientos`, {
        nombre,
        razonSocial,
        direccion,
        factorOcupacional,
        habilitacion
    })
    .then(response => {
        loadAndDisplayEstablecimientos(); // Llamada corregida
        document.getElementById('EstablecimientoForm').reset();
    })
    .catch(error => console.error('Error al agregar establecimiento', error));
}

//handle to edit
function editEstablecimiento() {
    if (selectedRowId) {
        axios.get(`${API_BASE_URL}/establecimientos/${selectedRowId}`)
            .then(response => {
                const establecimiento = response.data;

                const nombre = prompt('Nuevo nombre del establecimiento:', establecimiento.nombre);
                const razonSocial = prompt('Nueva razón social:', establecimiento.razonSocial);
                const direccion = prompt('Nueva dirección:', establecimiento.direccion);
                let factorOcupacional = prompt('Nuevo factor ocupacional:', establecimiento.factorOcupacional);
                factorOcupacional = factorOcupacional ? parseInt(factorOcupacional, 10) : establecimiento.factorOcupacional;
                const habilitacion = confirm('¿Habilitación? (Aceptar = Sí, Cancelar = No)');
                if (nombre && razonSocial && direccion && !isNaN(factorOcupacional)) {
                    axios.put(`${API_BASE_URL}/establecimientos/${selectedRowId}`, {
                        idEstablecimiento: selectedRowId,
                        nombre,
                        razonSocial,
                        direccion,
                        habilitacion,
                        factorOcupacional
                    })
                    .then(response => loadAndDisplayEstablecimientos())
                    .catch(error => console.error('Error al editar establecimiento', error));
                } else {
                    console.error('Todos los campos deben ser válidos.');
                }
            })
            .catch(error => console.error('Error al obtener datos del establecimiento', error));
    }
}
// Function to handle delete
function deleteEstablecimiento() {
    if (selectedRowId && confirm('¿Estás seguro de que quieres eliminar este establecimiento?')) {
        axios.delete(`${API_BASE_URL}/establecimientos/${selectedRowId}`)
            .then(response => loadAndDisplayEstablecimientos())
            .catch(error => console.error('Error al eliminar establecimiento', error));
    }
}

// Function to handle copy
function copyEstablecimiento() {
    if (selectedRowId) {
        axios.get(`${API_BASE_URL}/establecimientos/${selectedRowId}`)
            .then(response => {
                const establecimiento = response.data;
                const copyText = `ID: ${establecimiento.idEstablecimiento}\nNombre: ${establecimiento.nombre}\nRazón Social: ${establecimiento.razonSocial}\nDirección: ${establecimiento.direccion}\nHabilitación: ${establecimiento.habilitacion}\nFactor Ocupacional: ${establecimiento.factOcupacional}`;
                navigator.clipboard.writeText(copyText)
                    .then(() => alert('Establecimiento copiado al portapapeles'))
                    .catch(err => console.error('Error al copiar establecimiento', err));
            })
            .catch(error => console.error('Error al obtener datos del establecimiento', error));
    }
}

// Function to handle form toggling
function toggleFormVisibility() {
    const form = document.getElementById('EstablecimientoForm');
    const header = document.getElementById('addEstablecimientoHeader');
    if (form.classList.contains('sticky')) {
        form.classList.remove('sticky');
        header.innerHTML = 'Agregar Establecimiento';
    } else {
        form.classList.add('sticky');
        header.innerHTML = 'Agregar Establecimiento (Sticky)';
    }
}

// Function to handle sorting

function sortTable(column) {
    // Si se hace clic en la misma columna, alternar entre ascendente y descendente
    if (currentSortColumn === column) {
        isAscending = !isAscending;
    } else {
        currentSortColumn = column;
        isAscending = true;
    }

    const sortedData = [...establecimientosData].sort((a, b) => {
        if (a[column] < b[column]) return isAscending ? -1 : 1;
        if (a[column] > b[column]) return isAscending ? 1 : -1;
        return 0;
    });
    displayEstablecimientos(sortedData);
}


// Event listeners
document.getElementById('EstablecimientoForm').addEventListener('submit', handleFormSubmit);
document.getElementById('editBtn').addEventListener('click', editEstablecimiento);
document.getElementById('deleteBtn').addEventListener('click', deleteEstablecimiento);
document.getElementById('copyBtn').addEventListener('click', copyEstablecimiento);
document.getElementById('toggleFormBtn').addEventListener('click', toggleFormVisibility);

// Load establecimientos on page load
document.addEventListener('DOMContentLoaded', loadAndDisplayEstablecimientos);
