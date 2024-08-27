const API_BASE_URL = 'http://localhost:8080';
let selectedRowId = null;
let contratosData = [];
let currentSortColumn = null;
let isAscending = true;

// Estado para saber si estamos agregando o editando
let isEditing = false;

// Function to load and display contratos
function loadAndDisplayContratos() {
    axios.get(`${API_BASE_URL}/contratosEmpEst`)
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
            <tr data-id="${contrato.idContratoEmpEst}" onclick="handleRowClick(event, ${contrato.idContratoEmpEst})">
                <td>${contrato.idContratoEmpEst}</td>
                <td>${formatDate(contrato.alta)}</td>
                <td>${formatDate(contrato.vencimiento)}</td>
                <td>${contrato.idEmpresa}</td>
                <td>${contrato.idEstablecimiento}</td>
                <td>${contrato.observaciones}</td>
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
    const altaElement = document.getElementById('alta');
    const vencimientoElement = document.getElementById('vencimiento');
    const idEmpresaElement = document.getElementById('idEmpresa');
    const idEstablecimientoElement = document.getElementById('idEstablecimiento');
    const observacionesElement = document.getElementById('observaciones');

    if (!altaElement || !vencimientoElement || !idEmpresaElement || !idEstablecimientoElement || !observacionesElement) {
        console.error('Uno o más elementos del formulario no se encuentran.');
        return;
    }

    const alta = altaElement.value;
    const vencimiento = vencimientoElement.value;
    const idEmpresa = idEmpresaElement.value;
    const idEstablecimiento = idEstablecimientoElement.value;
    const observaciones = observacionesElement.value;

    if (isEditing && selectedRowId) {
        saveContratoChanges(selectedRowId, alta, vencimiento, idEmpresa, idEstablecimiento, observaciones);
    } else {
        axios.post(`${API_BASE_URL}/contratosEmpEst`, {
            alta,
            vencimiento,
            idEmpresa,
            idEstablecimiento,
            observaciones
        })
        .then(response => {
            loadAndDisplayContratos();
            document.getElementById('contratoForm').reset();
        })
        .catch(error => showError('Error al agregar contrato. Posiblemente el ID de empresa/Establecimiento esté mal o no exista o el establecimiento ya tenga un contrato, verifique los datos e intente nuevamente.'));
    }
}

// Function to save contrato changes
function saveContratoChanges(id, alta, vencimiento, idEmpresa, idEstablecimiento, observaciones) {
    axios.put(`${API_BASE_URL}/contratosEmpEst/${id}`, {
        alta,
        vencimiento,
        idEmpresa,
        idEstablecimiento,
        observaciones
    })
    .then(response => {
        console.log('Contrato updated:', response.data);
        loadAndDisplayContratos();
        document.getElementById('contratoForm').reset();
        isEditing = false;
        document.getElementById('formSubmitBtn').textContent = 'Agregar Contrato';
    })
    .catch(error => showError('Error al editar contrato. Posiblemente el ID de empresa/Establecimiento esté mal o no exista o el establecimiento ya tenga un contrato, verifique los datos e intente nuevamente.'));
}

// Function to handle edit
function editContrato() {
    if (!selectedRowId) return;

    const contrato = contratosData.find(c => c.idContratoEmpEst === selectedRowId);

    if (contrato) {
        document.getElementById('alta').value = contrato.alta || '';
        document.getElementById('vencimiento').value = contrato.vencimiento || '';
        document.getElementById('idEmpresa').value = contrato.idEmpresa || '';
        document.getElementById('idEstablecimiento').value = contrato.idEstablecimiento || '';
        document.getElementById('observaciones').value = contrato.observaciones || '';

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
    if (currentSortColumn === column) {
        isAscending = !isAscending;
    } else {
        currentSortColumn = column;
        isAscending = true;
    }

    contratosData.sort((a, b) => {
        if (a[column] < b[column]) return isAscending ? -1 : 1;
        if (a[column] > b[column]) return isAscending ? 1 : -1;
        return 0;
    });

    displayContratos(contratosData);
}

function deleteContrato() {
    if (!selectedRowId) return;

    if (confirm('¿Estás seguro de que quieres eliminar este contrato?')) {
        axios.delete(`${API_BASE_URL}/contratosEmpEst/${selectedRowId}`)
            .then(response => {
                console.log('Contrato deleted:', response.data);
                loadAndDisplayContratos();
                toggleActionButtons(false);
            })
            .catch(error => console.error('Error deleting contrato:', error));
    }
}

function copyContrato() {
    if (selectedRowId) {
        const contrato = contratosData.find(c => c.idContratoEmpEst === selectedRowId);

        if (contrato) {
            // Copiar el contrato con una nueva ID (usando un ID ficticio o generado)
            axios.post(`${API_BASE_URL}/contratosEmpEst`, {
                alta: contrato.alta,
                vencimiento: contrato.vencimiento,
                idEmpresa: contrato.idEmpresa,
                idEstablecimiento: contrato.idEstablecimiento,
                observaciones: contrato.observaciones
            })
            .then(response => {
                loadAndDisplayContratos();
                selectedRowId = null;
                toggleActionButtons(false);
            })
            .catch(error => console.error('Error copying contrato:', error));
        }
    }
}

function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}

// Function to toggle sticky form
function toggleStickyForm() {
    const form = document.getElementById('contratoForm');
    if (form.classList.contains('sticky')) {
        form.classList.remove('sticky');
        document.getElementById('addContratoHeader').innerHTML = 'Agregar Contrato';
    } else {
        form.classList.add('sticky');
        document.getElementById('addContratoHeader').innerHTML = 'Agregar Contrato (Sticky)';
    }
}

// Event listeners
document.getElementById('toggleFormBtn').addEventListener('click', toggleStickyForm);
document.getElementById('editBtn').addEventListener('click', editContrato);
document.getElementById('deleteBtn').addEventListener('click', deleteContrato);
document.getElementById('copyBtn').addEventListener('click', copyContrato);
document.getElementById('contratoForm').addEventListener('submit', handleFormSubmit);
document.getElementById('toggleEditBtn').addEventListener('click', () => {
    isEditing = false;
    document.getElementById('formSubmitBtn').textContent = 'Agregar Contrato';
    document.getElementById('contratoForm').reset();
    document.getElementById('toggleEditBtn').style.display = 'none';
    // Cambiar el formulario a modo normal
    document.getElementById('contratoForm').classList.remove('sticky');
    document.getElementById('addContratoHeader').innerHTML = 'Agregar Contrato';
});

loadAndDisplayContratos();
