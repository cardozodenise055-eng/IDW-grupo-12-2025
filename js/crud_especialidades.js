const form = document.getElementById("formEspecialidad");
const mensaje = document.getElementById("mensaje");

const usuario = sessionStorage.getItem("usuarioLogueado");

if (!usuario) {
    window.location.href = "login.html";
}

/* Funciones para buscar especialidades */
function obtenerEspecialidades() {
    return JSON.parse(localStorage.getItem("especialidades") || "[]");
}

console.log(obtenerEspecialidades());

/* Función para obtener el siguiente ID */
function obtenerSiguienteId() {
    const especialidades = obtenerEspecialidades();

    if (especialidades.length === 0) {
        return 1;
    }

    const ultimoID = especialidades[especialidades.length - 1];
    return ultimoID.id + 1;
}

/* Función para guardar especialidades en LocalStorage */
function guardarEspecialidades(especialidades) {
    localStorage.setItem("especialidades", JSON.stringify(especialidades));
}

/* Función para guardar especialidades */
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
    return especialidades.find(o => o.id === id);
}

function actualizarEspecialidad(id, datosActualizados) {
    const especialidades = obtenerEspecialidades();
    const indice = especialidades.findIndex(o => o.id === id);

    if (indice !== -1) {
        especialidades[indice] = {
            ...especialidades[indice],
            ...datosActualizados
        };
        guardarEspecialidades(especialidades);
        console.log("Especialidad actualizada correctamente:", especialidades[indice]);
        window.location.href = "listarProfesionales.html";
    } else {
        console.log("No se encontró una especialidad con ese id.");
    }
}

function editarEspecialidad(id) {
    const especialidad = buscarEspecialidadporid(id);

    if (especialidad) {
        document.getElementById("id").value = especialidad.id;
        document.getElementById("nombre").value = especialidad.nombre;
        document.getElementById("nombre").value = especialidad.descripcion;

    } else {
        console.log("No se encontró una obra social con ese id.");
        alert(`No se encontró una obra social con ese id: ${id}.`);
    }
}

function guardarCambios() {
    const id = document.getElementById("id").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripción").value.trim();

    const datosActualizados = {
        nombre,
        descripcion,
        dni,

    };

    actualizarEspecialidad(id, datosActualizados);
}
/* Manejo del formulario */
function crearEspecialidad(e) {
    e.preventDefault();

    console.log('Muestro en consola las especialidades antes de guardar el Nuevo', obtenerEspecialidades());

    const nombre = document.getElementById("nombre").value.trim();

    if (!nombre) {
        alert('Por favor completa los campos requeridos');
        return;
    }

    /* alert(
        `especialidad registrada:\n\n` +
        `nombre: ${nombre}\n`
    ); */

    const nuevaEspecialidad = {
        nombre: nombre,
    };

    agregarEspecialidad(nuevaEspecialidad);

    form.reset();
};

if (form) {
    form.addEventListener("submit", crearEspecialidad);
}

const cardEspecialidades = document.querySelector('#cardEspecialidades')

let flagIndex = null;

function actualizarTabla() {
    let especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    cardEspecialidades.innerHTML = '';

    console.log(especialidades)
    especialidades.forEach(function (especialidad, index) {
        let fila = document.createElement('div');
        fila.classList.add('col');
        fila.innerHTML = `
            <div class="card h-100 profesional-card">
                <div class="card-body">
                    <h5 class="card-title">${especialidad.nombre}</h5>
                    <p class="card-text">${especialidad.descripcion}</p>
                    <a href="formularioMedicosEditar.html?id=${especialidad.id}" class="btn btn-primary">Editar</a>
                </div>
            </div>
        `;
        cardEspecialidades.appendChild(fila);
    })

}

document.addEventListener('DOMContentLoaded', () => {
    if (!sessionStorage.getItem('token')) {
        alert("Debe loguearse");
        window.location.href = '../login.html';
        return;
    }
})

if (cardEspecialidades) {
    actualizarTabla();
}

function eliminarEspecialidad(id) {
    const especialidades = obtenerEspecialidades();
    const nuevasEspecialidades = especialidades.filter(e => e.id !== id);

    if (nuevasEspecialidades.length === especialidades.length) {
        console.log("No se encontró una especialidad con ese id.");
        return;
    }

    guardarEspecialidades(nuevasEspecialidades);
    console.log("Especialidad eliminada correctamente.");
}

window.addEventListener("DOMContentLoaded", () => {
    /* session */
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

    /* fin session */
    const btnEliminar = document.getElementById("btnEliminar");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
        editarEspecialidad(id);

        // Guardar cambios
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            guardarCambios();

            if (mensaje) {
                mensaje.classList.remove("d-none");
                setTimeout(() => mensaje.classList.add("d-none"), 3000);
            }
        });

        // Eliminar especialidad
        if (btnEliminar) {
            btnEliminar.addEventListener("click", function () {
                if (confirm("¿Seguro que querés eliminar esta especialidad?")) {
                    eliminarEspecialidad(id);
                    alert("Especialidad eliminada correctamente.");
                    window.location.href = "formularioMedicos.html";
                }
            });
        } else {
            return;
        }
    }
});