const API_BASE_URL = 'http://localhost:8080';
let selectedRowId = null;
let contratosData = [];
let currentSortColumn = null;
let isAscending = true;

// Estado para saber si estamos agregando o editando
let isEditing = false;

// Function to load and display contratos
function loadAndDisplayContratos() {
    axios.get(`${API_BASE_URL}/contratos`)
        .then(response => {
            contratosData = response.data;
            displayContratos(contratosData);
        })
        .catch(error => console.error('Error loading contratos:', error));
}
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}
function displayContratos(contratos) {
    const tableBody = document.getElementById('contratosTableBody');
    tableBody.innerHTML = '';
    contratos.forEach(contrato => {
        tableBody.innerHTML += `
            <tr data-id="${contrato.idContratos}" onclick="handleRowClick(event, ${contrato.idContratos})">
                <td>${contrato.idContratos}</td>
                <td>${formatDate(contrato.alta)}</td>
                <td>${formatDate(contrato.vencimiento)}</td>
                <td>${contrato.idEmpresa}</td>
                <td>${contrato.idControlador}</td>
            </tr>
        `;
    });
}

// Function to handle row click
function handleRowClick(event, id) {
    document.querySelectorAll('#contratosTableBody tr').forEach(row => row.classList.remove('selected'));
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
    const alta = document.getElementById('alta').value;
    const vencimiento = document.getElementById('vencimiento').value;
    const idEmpresa = document.getElementById('idEmpresa').value;
    const idControlador = document.getElementById('idControlador').value;

    if (isEditing && selectedRowId) {
        saveContratoChanges(selectedRowId, alta, vencimiento, idEmpresa, idControlador);
    } else {
        axios.post(`${API_BASE_URL}/contratos`, {
            alta,
            vencimiento,
            idEmpresa,
            idControlador
        })
        .then(response => {
            loadAndDisplayContratos();
            document.getElementById('contratoForm').reset();
        })
        .catch(error => showError('Error al agregar contrato. Posiblemente el ID de empresa/controlador esté mal o no exista, verifique los datos e intente nuevamente.'));
    }
}

// Function to save contrato changes
function saveContratoChanges(id, alta, vencimiento, idEmpresa, idControlador) {
    axios.put(`${API_BASE_URL}/contratos/${id}`, {
        alta,
        vencimiento,
        idEmpresa,
        idControlador
    })
    .then(response => {
        console.log('Contrato updated:', response.data);
        loadAndDisplayContratos();
        document.getElementById('contratoForm').reset();
        isEditing = false;
        document.getElementById('formSubmitBtn').textContent = 'Agregar Contrato';
    })
    .catch(error => console.error('Error updating contrato:', error));
}

// Function to handle edit
function editContrato() {
    if (!selectedRowId) return;

    const contrato = contratosData.find(c => c.idContratos === selectedRowId);

    if (contrato) {
        document.getElementById('alta').value = contrato.alta || '';
        document.getElementById('vencimiento').value = contrato.vencimiento || '';
        document.getElementById('idEmpresa').value = contrato.idEmpresa || '';
        document.getElementById('idControlador').value = contrato.idControlador || '';

        // Cambiar el botón a "Guardar Cambios"
        const formSubmitBtn = document.getElementById('formSubmitBtn');
        formSubmitBtn.textContent = 'Guardar Cambios';
        isEditing = true;

        // Verificar si el formulario ya está visible en pantalla
        const form = document.getElementById('contratoForm');
        const rect = form.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

        // Si el formulario no está visible, hacerlo sticky
        if (!isVisible && !form.classList.contains('sticky')) {
            form.classList.add('sticky');
            document.getElementById('addContratoHeader').innerHTML = 'Agregar Contrato (Sticky)';
        }

        // Limpiar cualquier evento onclick anterior para evitar múltiples eventos
        formSubmitBtn.onclick = null;

        // Asignar un nuevo evento onclick para guardar los cambios
        formSubmitBtn.onclick = handleFormSubmit;

        // Mostrar el botón para alternar entre edición y adición
        document.getElementById('toggleEditBtn').style.display = 'block';
    } else {
        console.error('No se encontró un contrato con el ID seleccionado.');
    }
}

function sortTable(column) {
    // Si se hace clic en la misma columna, alternar entre ascendente y descendente
    if (currentSortColumn === column) {
        isAscending = !isAscending;
    } else {
        currentSortColumn = column;
        isAscending = true;
    }

    const sortedData = [...contratosData].sort((a, b) => {
        if (a[column] < b[column]) return isAscending ? -1 : 1;
        if (a[column] > b[column]) return isAscending ? 1 : -1;
        return 0;
    });
    displayContratos(sortedData);
}

// Function to toggle between edit and add mode
function toggleEditMode() {
    const formSubmitBtn = document.getElementById('formSubmitBtn');
    const form = document.getElementById('contratoForm');

    if (isEditing) {
        // Cancelar la edición y volver al modo de adición
        document.getElementById('contratoForm').reset();
        formSubmitBtn.textContent = 'Agregar Contrato';
        isEditing = false;
        
        // Quitar el modo sticky si estaba activado
        if (form.classList.contains('sticky')) {
            form.classList.remove('sticky');
        }
        
        // Ocultar el botón de alternar modo
        document.getElementById('toggleEditBtn').style.display = 'none';
    }
}

// Event listeners
document.getElementById('toggleEditBtn').addEventListener('click', toggleEditMode);
// Function to handle delete
function deleteContrato() {
    if (!selectedRowId) return;

    if (confirm('¿Estás seguro de que quieres eliminar este contrato?')) {
        axios.delete(`${API_BASE_URL}/contratos/${selectedRowId}`)
            .then(response => {
                console.log('Contrato deleted:', response.data);
                loadAndDisplayContratos();
                toggleActionButtons(false);
            })
            .catch(error => console.error('Error deleting contrato:', error));
    }
}

// Function to handle copy
function copyContrato() {
    if (!selectedRowId) return;

    const contrato = contratosData.find(c => c.idContratos === selectedRowId);

    if (contrato) {
        document.getElementById('alta').value = contrato.alta;
        document.getElementById('vencimiento').value = contrato.vencimiento;
        document.getElementById('idEmpresa').value = contrato.idEmpresa;
        document.getElementById('idControlador').value = contrato.idControlador;

        // Cambiar el botón a "Guardar Copia"
        document.getElementById('formSubmitBtn').textContent = 'Guardar Copia';
        document.getElementById('formSubmitBtn').onclick = handleFormSubmit;
    }
}

// Function to handle form toggling
function toggleFormVisibility() {
    const form = document.getElementById('contratoForm');
    const header = document.getElementById('addContratoHeader');

    if (form.classList.contains('sticky')) {
        form.classList.remove('sticky');
        header.innerHTML = 'Agregar Contrato';
    } else {
        form.classList.add('sticky');
        header.innerHTML = 'Agregar Contrato (Sticky)';
    }
}

function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    } else {
        alert(message);  // Si no hay un contenedor de errores, usa un alert
    }
}

// Event listeners
document.getElementById('contratoForm').addEventListener('submit', handleFormSubmit);
document.getElementById('editBtn').addEventListener('click', editContrato);
document.getElementById('deleteBtn').addEventListener('click', deleteContrato);
document.getElementById('copyBtn').addEventListener('click', copyContrato);
document.getElementById('toggleFormBtn').addEventListener('click', toggleFormVisibility);

// Load contratos on page load
loadAndDisplayContratos();