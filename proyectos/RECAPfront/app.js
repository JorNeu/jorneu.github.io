// Configura la URL base de la API
const API_BASE_URL = 'http://localhost:8080';

// Función para cargar empresas
function loadEmpresas() {
    axios.get(`${API_BASE_URL}/empresas`)
        .then(response => {
            const empresas = response.data;
            const tableBody = document.getElementById('empresasTableBody');
            tableBody.innerHTML = '';
            empresas.forEach(empresa => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${empresa.idEmpresa}</td>
                        <td>${empresa.nombre}</td>
                        <td>${empresa.resolucion}</td>
                        <td>${empresa.socio1}</td>
                        <td>${empresa.socio2}</td>
                        <td>
                            <button class="edit" onclick="editEmpresa(${empresa.idEmpresa})">Editar</button>
                            <button class="delete" onclick="deleteEmpresa(${empresa.idEmpresa})">Eliminar</button>
                            <button class="copy" onclick="copyEmpresa(${empresa.idEmpresa})">Copiar</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error al cargar empresas', error));
}

// Función para agregar una empresa
function addEmpresa(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombreEmpresa').value;
    const resolucion = document.getElementById('resolucionEmpresa').value;
    const socio1 = document.getElementById('socio1Empresa').value;
    const socio2 = document.getElementById('socio2Empresa').value;

    axios.post(`${API_BASE_URL}/empresas`, { nombre, resolucion, socio1, socio2 })
        .then(response => {
            loadEmpresas();
            document.getElementById('empresaForm').reset(); // Limpiar el formulario
        })
        .catch(error => console.error('Error al agregar empresa', error));
}

// Función para editar una empresa
function editEmpresa(idEmpresa) {
    const nombre = prompt('Nuevo nombre de la empresa:');
    const resolucion = prompt('Nueva resolución de la empresa:');
    const socio1 = prompt('Nuevo socio 1 de la empresa:');
    const socio2 = prompt('Nuevo socio 2 de la empresa:');
    if (nombre && resolucion && socio1 && socio2) {
        axios.put(`${API_BASE_URL}/empresas/${idEmpresa}`, { nombre, resolucion, socio1, socio2 })
            .then(response => loadEmpresas())
            .catch(error => console.error('Error al editar empresa', error));
    }
}

// Función para eliminar una empresa
function deleteEmpresa(idEmpresa) {
    axios.delete(`${API_BASE_URL}/empresas/${idEmpresa}`)
        .then(response => loadEmpresas())
        .catch(error => console.error('Error al eliminar empresa', error));
}

// Función para copiar una empresa
function copyEmpresa(idEmpresa) {
    axios.get(`${API_BASE_URL}/empresas/${idEmpresa}`)
        .then(response => {
            const empresa = response.data;
            const text = `ID: ${empresa.idEmpresa}\nNombre: ${empresa.nombre}\nResolución: ${empresa.resolucion}\nSocio 1: ${empresa.socio1}\nSocio 2: ${empresa.socio2}`;
            navigator.clipboard.writeText(text)
                .then(() => alert('Datos copiados al portapapeles'))
                .catch(error => console.error('Error al copiar datos', error));
        })
        .catch(error => console.error('Error al copiar empresa', error));
}

// Cargar los datos al cargar la página
window.onload = function() {
    loadEmpresas();
    document.getElementById('empresaForm').addEventListener('submit', addEmpresa);
};