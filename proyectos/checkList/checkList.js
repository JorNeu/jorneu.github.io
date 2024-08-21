let listartask = async () => {
    const peticion = await fetch("http://localhost:8080/api/task", {
        method: "GET",
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        }
    });

    const taskss = await peticion.json();

    for (let i = taskss.length - 1; i >= 0; i--) {
        let t = taskss[i].text;
        insertTask(t, taskss[i].id);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Tu código aquí
    listartask(); // Llamar a listartask después de que el DOM esté completamente cargado
});

// Agregar tarea a la base de datos
let registrartask = async () => {
    let campos = {};
    campos.text = formInput.value;
    try {
        console.log(campos)
        const peticion = await fetch("http://localhost:8080/api/task", {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify(campos)
        });

        if (!peticion.ok) {
            throw new Error('Error al enviar los datos');
        }

        // Si la solicitud fue exitosa, puedes realizar acciones adicionales aquí
        console.log("Datos enviados correctamente");
    } catch (error) {
        console.error('Hubo un problema con la solicitud fetch:', error.message);
    }
}

// Agregar tarea y verificar que no sea espacio
const formInput = document.querySelector(".inputTask");
const formButton = document.querySelector(".add");
let id = 0; // Contador para el ID del elemento LI
let checkbox = 9999; // Contador para el valor del checkbox
formButton.addEventListener("click", (e) => {
    e.preventDefault();
    const text = formInput.value;
    console.log(text);
    if (text == "Escribe una nueva tarea" || text == "") {
        alert("Rellena bien el formulario");
    } else {
        registrartask();
        insertTask(text, id);
        id++;
        checkbox--;
    }
});

// Crear y inicializar tarea
function insertTask(task, id) {
    const ul = document.querySelector(".taskList");
    // Crear el LI con sus clases, etc.
    const li = document.createElement("LI");
    li.addEventListener("click", () => { posHidden(id) });
    li.classList.add("task");
    li.id = id;
    li.tabIndex = id;
    // Crear el div con las clases
    const div = document.createElement('div');
    div.classList.add('checklist');
    // Crear el checkbox
    const input = document.createElement('input');
    input.setAttribute('value', checkbox); // Asignar el valor del checkbox
    input.setAttribute('name', 'r');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', 'checkbox_' + id); // Asignar un ID único al checkbox
    // Crear el label con el mismo valor que el checkbox
    const label = document.createElement('label');
    label.setAttribute('for', 'checkbox_' + id); // Asignar el ID del checkbox
    let texto = document.createTextNode(task);

    label.appendChild(texto);
    div.appendChild(input);
    div.appendChild(label);

    li.appendChild(div);
    ul.appendChild(li);
}

// Mostrar ID de cada tarea al darle click
const posHidden = (num) => {
    document.querySelector(".posData").value = num;
}

// Crear botón de borrar
const deleteButton = document.querySelector(".del");
// Evento del botón borrar y verificar que haya una tarea seleccionada
deleteButton.addEventListener("click", (e) => {
    e.preventDefault();
    const pos = document.querySelector(".posData").value;
    if (pos === "") {
        alert("Primero seleccione la tarea a eliminar");
    } else {
        const parentNode = document.querySelector(".taskList");
        const childNode = document.getElementById(pos);
        parentNode.removeChild(childNode);
        borrartask(pos);
    }
});
// Agregar tarea a la base de datos
let borrartask = async (id) => {
        const peticion = await fetch("http://localhost:8080/api/task/"+id, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
        });

}