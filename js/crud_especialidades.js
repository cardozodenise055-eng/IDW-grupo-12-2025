/* Función para guardar especialidades en LocalStorage */
function guardarEspecialidades(especialidades) {
    localStorage.setItem("especialidades", JSON.stringify(especialidades));
}
function obtenerEspecialidades() {
    return JSON.parse(localStorage.getItem("especialidades"));
}

/* Función para obtener el siguiente ID */
function obtenerSiguienteId() {
    const medicos = obtenerEspecialidades();
    const ultimoID = medicos[medicos.length - 1];
    return ultimoID.id + 1;
}

/* Función para guardar especialidades */
function agregarEspecialidad(especialidad) {


    const especialidades = obtenerEspecialidades();
    especialidades.push(especialidad);
    guardarEspecialidades(especialidades);

    document.getElementById("mensaje").classList.remove("d-none");

    console.log('Muestro en consola las especialidades después de guardar el Nuevo', obtenerEspecialidades());
}

function buscarporEspecialidad(especialidad) {
    const especialidades = obtenerEspecialidades();
    return especialidades.find(e => e.nombre === especialidad);
}

function editarEspecialidades(especialidad) {
    const especialidad = buscarporEspecialidad(especialidad);

    if (especialidad) {
        document.getElementById("nombre").value = especialidad.nombre;
    
    } else {
        console.log("No se encontró una especialidad.");
        alert(`No se encontró una especialidad con el nombre: ${especialidad}.`);
    }
}

function guardarCambios() {
    const nombre = document.getElementById("nombre").value.trim();

    const datosActualizados = {
        nombre,
        
    };
    const especialidadencontrada = buscarporEspecialidad(nombre)

    actualizarEspecialidad(especialidadencontrada.id, datosActualizados);
}

function actualizarEspecialidad(id, datosActualizados) {
    const especialidad = obtenerEspecialidades();
    const indice = especialidad.findIndex(e => e.id === id);

    if (indice !== -1) {
        especialidad[indice] = {
            ...especialidad[indice],
            ...datosActualizados
        };
        guardarEspecialidades(especialidad);
        console.log("Especialidad actualizada correctamente:", especialidad[indice]);
        window.location.href = "listarProfesionales.html";
    } else {
        console.log("No se encontró una especialidad.");
    }
}
/* Manejo del formulario */
function crearEspecialidad(e) {
    e.preventDefault();

    console.log('Muestro en consola las especialidades antes de guardar el Nuevo', obtenerEspecialidades());

    const especialidad = document.getElementById("especialidad").value.trim();
  

    if (!nombre || !especialidad ) {
        alert('Por favor completa los campos requeridos');
        return;
    }

    if (!archivo) {
        alert("Debe seleccionar una imagen del médico");
        return;
    }

    const lector = new FileReader();

    lector.onloadend = () => {
        const imagenBase64 = lector.result;

        alert(
            `especialidad registrada:\n\n` 
        
        );

        const nuevasEspecialidades = {
            nombre: nombre,
            
        };

        agregarEspecialidad(nuevasEspecialidades);

        form.reset();
    };

    lector.readAsDataURL(archivo);
}

if (form) {
    form.addEventListener("submit", crearEspecialidad);
}

const cardEspecialidades = document.querySelector('#cardEspecialidades')

let flagIndex = null;


function eliminarEspecialidad() {
    const especialidad = obtenerEspecialidades();
    const nuevasEspecialidades = especialidad.filter(e => e.nombre !== nombre);

    if (nuevasEspecialidades.length === especialidad.length) {
        console.log("No se encontró una especialidad con ese nombre.");
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

    const form = document.getElementById("formEspecialidades");
    const mensaje = document.getElementById("mensaje");
    const btnEliminar = document.getElementById("btnEliminar");

    const params = new URLSearchParams(window.location.search);
    const especialidad = params.get("especialidad");

    if (especialidad) {
        editarEspecialidades(especialidad);

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
                    eliminarEspecialidad(especialidad);
                    alert("Especialidad eliminada correctamente.");
                    window.location.href = "formularioMedicos.html";
                }
            });
        } else {
            return;
        }
    }

});