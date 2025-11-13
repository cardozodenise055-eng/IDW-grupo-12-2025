const form = document.getElementById("formEspecialidad");
const mensaje = document.getElementById("mensaje");
const tablaEspecialidades = document.getElementById("tabla-especialidades");

const usuario = sessionStorage.getItem("usuarioLogueado");

if (!usuario) {
    window.location.href = "login.html";
}


function obtenerEspecialidades() {
    return JSON.parse(localStorage.getItem("especialidades") || "[]");
}

console.log(obtenerEspecialidades());


function obtenerSiguienteId() {
    const especialidades = obtenerEspecialidades();

    if (especialidades.length === 0) {
        return 1;
    }

    const ultimoID = especialidades[especialidades.length - 1];
    return ultimoID.id + 1;
}

function guardarEspecialidades(especialidades) {
    localStorage.setItem("especialidades", JSON.stringify(especialidades));
}

function agregarEspecialidad(especialidad) {

    especialidad.id = obtenerSiguienteId();

    const especialidades = obtenerEspecialidades();
    especialidades.push(especialidad);
    guardarEspecialidades(especialidades);

    document.getElementById("mensaje").classList.remove("d-none");

    console.log('Muestro en consola las especialidades después de guardar el Nuevo', obtenerEspecialidades());
}

function buscarEspecialidadporid(id) {
    const especialidades = obtenerEspecialidades();
    return especialidades.find(e => e.id === id);
}

function actualizarEspecialidad(id, datosActualizados) {
    const especialidades = obtenerEspecialidades();
    const indice = especialidades.findIndex(e => e.id === id);

    if (indice !== -1) {
        especialidades[indice] = {
            ...especialidades[indice],
            ...datosActualizados
        };
        guardarEspecialidades(especialidades);
        console.log("Especialidad actualizada correctamente:", especialidades[indice]);
        
        mostrarEspecialidades();
        form.reset();
        form.querySelector("button[type='submit']").textContent = "Guardar Especialidad"

    } else {
        console.log("No se encontró una especialidad con ese id.");
    }
}

function editarEspecialidad(id) {
    const especialidad = buscarEspecialidadporid(id);

    if (especialidad) {
        document.getElementById("id").value = especialidad.id;
        document.getElementById("nombre").value = especialidad.nombre;
        document.getElementById("descripcion").value = especialidad.descripcion;
        form.querySelector("button[type='submit']").textContent = "Guardar cambios"

    } else {
        console.log("No se encontró una esecialidad con ese id.");
        alert(`No se encontró una especialidad con ese id: ${id}.`);
    }
}

function guardarCambios() {
    const id = document.getElementById("id").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    const datosActualizados = {
        nombre,
        descripcion,

    };

    actualizarEspecialidad(id, datosActualizados);
}

function crearEspecialidad(e) {
    e.preventDefault();

    if (form.querySelector("button[type= 'submit']").textContent === "Guardar cambios") {
        guardarCambios();
        return;
    }

    console.log('Muestro en consola las especialidades antes de guardar el Nuevo', obtenerEspecialidades());

    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    if (!nombre || !descripcion) {
        alert('Por favor completa los campos requeridos');
        return;
    }

    const nuevaEspecialidad = {
        nombre: nombre,
        descripcion: descripcion
    };

    agregarEspecialidad(nuevaEspecialidad);

    form.reset();

    mostrarEspecialidades();
};

if (form) {
    form.addEventListener("submit", crearEspecialidad);
}

function eliminarEspecialidad(id) {
    console.log(id)
    const especialidades = obtenerEspecialidades();
    const nuevasEspecialidades = especialidades.filter(e => e.id !== id);

    if (nuevasEspecialidades.length === especialidades.length) {
        console.log("No se encontró una especialidad con ese id.");
        return;
    }

    guardarEspecialidades(nuevasEspecialidades);
    console.log("Especialidad eliminada correctamente.");

    mostrarEspecialidades();
}

function mostrarEspecialidades() {
    const especialidades = obtenerEspecialidades();

    tablaEspecialidades.innerHTML = ""
    especialidades.forEach((os, index) => {
        const fila = document.createElement("tr")

        fila.innerHTML = `
            <td>${os.id}</td>
            <td>${os.nombre}</td>
            <td>${os.descripcion}</td>
            <td> 
                <button class="btn btn-danger btn-sm" onclick="eliminarEspecialidad(${os.id})">Eliminar</button>
                <button class="btn btn-primary btn-sm" onclick="editarEspecialidad(${os.id})">Editar</button>
            </td>`

    tablaEspecialidades.appendChild(fila)
    })
}

window.addEventListener('DOMContentLoaded', () => {

    if (!sessionStorage.getItem('token')) {
        alert("Debe loguearse");
        window.location.href = '../login.html';
        return;
    }

    mostrarEspecialidades()

    const navSesion = document.getElementById("navSesion");
    const usuario = sessionStorage.getItem("usuarioLogueado");

    if (usuario) {
        navSesion.innerHTML = `
      <button id="btnCerrar" class="btn btn-outline-light btn-sm ms-2 my-1">
        Cerrar sesión
      </button>
    `;

        document.getElementById("btnCerrar").addEventListener("click", () => {
            sessionStorage.removeItem("usuarioLogueado");
            window.location.href = "login.html";
        });

    } else {
        navSesion.innerHTML = `
      <a href="login.html" class="btn btn-outline-light btn-sm ms-2 my-1">
        Iniciar sesión
      </a>
    `;
    }

});