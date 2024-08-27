const API_BASE_URL = 'http://localhost:8080';
let selectedRowId = null;
let empresasData = [];



// Function to load and display empresas with cantidad de controladores
function loadAndDisplayEmpresas() {
    axios.get(`${API_BASE_URL}/empresas`)
        .then(response => {
            empresasData = response.data;
            const controladoresPromises = empresasData.map(empresa =>
                axios.get(`${API_BASE_URL}/empresas/${empresa.idEmpresa}/controladores`)
            );

            Promise.all(controladoresPromises)
                .then(controladoresResponses => {
                    controladoresResponses.forEach((res, index) => {
                        empresasData[index].cantidadControladores = res.data;
                    });
                    displayEmpresas(empresasData);
                })
                .catch(error => console.error('Error al obtener cantidad de controladores', error));
        })
        .catch(error => console.error('Error al cargar empresas', error));
}

// Function to display empresas in the table
function displayEmpresas(empresas) {
    const tableBody = document.getElementById('empresasTableBody');
    tableBody.innerHTML = '';
    empresas.forEach(empresa => {
        tableBody.innerHTML += `
            <tr data-id="${empresa.idEmpresa}" onclick="handleRowClick(event, ${empresa.idEmpresa})">
                <td>${empresa.idEmpresa}</td>
                <td>${empresa.nombre}</td>
                <td>${empresa.resolucion}</td>
                <td>${empresa.socio1}</td>
                <td>${empresa.socio2}</td>
                <td>${empresa.cantidadControladores}</td>
            </tr>
        `;
    });
}

// Function to handle row click
function handleRowClick(event, id) {
    // Deselect previously selected row
    document.querySelectorAll('#empresasTableBody tr').forEach(row => row.classList.remove('selected'));
    
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
    const nombre = document.getElementById('nombreEmpresa').value;
    const resolucion = document.getElementById('resolucionEmpresa').value;
    const socio1 = document.getElementById('socio1Empresa').value;
    const socio2 = document.getElementById('socio2Empresa').value;

    axios.post(`${API_BASE_URL}/empresas`, { nombre, resolucion, socio1, socio2 })
        .then(response => {
            loadAndDisplayEmpresas();
            document.getElementById('empresaForm').reset();
        })
        .catch(error => console.error('Error al agregar empresa', error));
}

// Function to handle edit
function editEmpresa() {
    if (selectedRowId) {
        axios.get(`${API_BASE_URL}/empresas/${selectedRowId}`)
            .then(response => {
                const empresa = response.data;
                const nombre = prompt('Nuevo nombre de la empresa:', empresa.nombre);
                const resolucion = prompt('Nueva resolución:', empresa.resolucion);
                const socio1 = prompt('Nuevo socio 1:', empresa.socio1);
                const socio2 = prompt('Nuevo socio 2:', empresa.socio2);

                if (nombre && resolucion && socio1 && socio2) {
                    axios.put(`${API_BASE_URL}/empresas/${selectedRowId}`, {
                        idEmpresa: selectedRowId,
                        nombre,
                        resolucion,
                        socio1,
                        socio2
                    })
                    .then(response => loadAndDisplayEmpresas())
                    .catch(error => console.error('Error al editar empresa', error));
                }
            })
            .catch(error => console.error('Error al obtener datos de la empresa', error));
    }
}

// Function to handle delete
function deleteEmpresa() {
    if (selectedRowId && confirm('¿Estás seguro de que quieres eliminar esta empresa?')) {
        axios.delete(`${API_BASE_URL}/empresas/${selectedRowId}`)
            .then(response => loadAndDisplayEmpresas())
            .catch(error => console.error('Error al eliminar empresa', error));
    }
}

// Function to handle copy
function copyEmpresa() {
    if (selectedRowId) {
        axios.get(`${API_BASE_URL}/empresas/${selectedRowId}`)
            .then(response => {
                const empresa = response.data;
                const copyText = `ID: ${empresa.idEmpresa}\nNombre: ${empresa.nombre}\nResolución: ${empresa.resolucion}\nSocio 1: ${empresa.socio1}\nSocio 2: ${empresa.socio2}`;
                navigator.clipboard.writeText(copyText)
                    .then(() => alert('Empresa copiada al portapapeles'))
                    .catch(error => console.error('Error al copiar empresa', error));
            })
            .catch(error => console.error('Error al obtener datos de la empresa', error));
    }
}

// Function to sort table
function sortTable(column) {
    const sortedData = [...empresasData].sort((a, b) => {
        if (a[column] < b[column]) return -1;
        if (a[column] > b[column]) return 1;
        return 0;
    });
    displayEmpresas(sortedData);
}

// Function to toggle sticky form
function toggleStickyForm() {
    const form = document.getElementById('empresaForm');
    const header = document.getElementById('addEmpresaHeader');
    if (form.classList.contains('sticky')) {
        form.classList.remove('sticky');
        header.classList.remove('sticky');
    } else {
        form.classList.add('sticky');
        header.classList.add('sticky');
    }
}

// Event listeners
document.getElementById('empresaForm').addEventListener('submit', handleFormSubmit);
document.getElementById('editBtn').addEventListener('click', editEmpresa);
document.getElementById('deleteBtn').addEventListener('click', deleteEmpresa);
document.getElementById('copyBtn').addEventListener('click', copyEmpresa);
document.getElementById('toggleFormBtn').addEventListener('click', toggleStickyForm);

// Initial load
loadAndDisplayEmpresas();