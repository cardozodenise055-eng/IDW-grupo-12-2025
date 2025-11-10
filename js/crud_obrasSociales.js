/* Función para guardar obras sociales en LocalStorage */
function guardarObrasSociales(obrasSociales) {
    localStorage.setItem("obrasSociales", JSON.stringify(obrasSociales));
}
function obtenerObrasSociales() {
    return JSON.parse(localStorage.getItem("obrasSociales"));
}

/* Función para obtener el siguiente ID */
function obtenerSiguienteId() {
    const medicos = obtenerObrasSociales();
    const ultimoID = medicos[medicos.length - 1];
    return ultimoID.id + 1;
}

/* Función para guardar obras sociales */
function agregarObraSocial(obraSocial) {


    const obrasSociales = obtenerObrasSociales();
    obrasSociales.push(obraSocial);
    guardarObrasSociales(obrasSociales);

    document.getElementById("mensaje").classList.remove("d-none");

    console.log('Muestro en consola las obras sociales después de guardar el Nuevo', obtenerObrasSociales());
}

function buscarporObraSocial(obraSocial) {
    const obrasSociales = obtenerObrasSociales();
    return obrasSociales.find(e => e.nombre === obraSocial);
}

function editarObrasSociales(obraSocial) {
    const obraSocial = buscarporObraSocial(obraSocial);

    if (obraSocial) {
        document.getElementById("nombre").value = obraSocial.nombre;
    
    } else {
        console.log("No se encontró una obra social con ese nombre.");
        alert(`No se encontró una obra social con el nombre: ${obraSocial}.`);
    }
}

function guardarCambios() {
    const nombre = document.getElementById("nombre").value.trim();

    const datosActualizados = {
        nombre,
        
    };
    const obraSocialencontrada = buscarporObraSocial(nombre)

    actualizarObraSocial(obraSocialencontrada.id, datosActualizados);
}

function actualizarObraSocial(id, datosActualizados) {
    const obraSocial = obtenerObrasSociales();
    const indice = obraSocial.findIndex(e => e.id === id);

    if (indice !== -1) {
        obraSocial[indice] = {
            ...obraSocial[indice],
            ...datosActualizados
        };
        guardarObrasSociales(obraSocial);
        console.log("obra social actualizada correctamente:", obraSocial[indice]);
        window.location.href = "listarProfesionales.html";
    } else {
        console.log("No se encontró una obra social.");
    }
}
/* Manejo del formulario */
function crearObraSocial(e) {
    e.preventDefault();

    console.log('Muestro en consola las obras sociales antes de guardar el Nuevo', obtenerObrasSociales());

    const obraSocial = document.getElementById("obra social").value.trim();
  

    if (!nombre || !obraSocial ) {
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
            `obra social registrada:\n\n` 
        
        );

        const nuevasObrasSociales = {
            nombre: nombre,
            
        };

        agregarObraSocial(nuevasObrasSociales);

        form.reset();
    };

    lector.readAsDataURL(archivo);
}

if (form) {
    form.addEventListener("submit", crearObraSocial);
}

const cardObrasSociales = document.querySelector('#cardObrasSociales')

let flagIndex = null;


function eliminarObraSocial() {
    const obraSocial = obtenerObrasSociales();
    const nuevasObrasSociales = obraSocial.filter(e => e.nombre !== nombre);

    if (nuevasObrasSociales.length === obraSocial.length) {
        console.log("No se encontró una obra social con ese nombre.");
        return;
    }
    

    guardarObrasSociales(nuevasObrasSociales);
    console.log("Obra Social eliminada correctamente.");
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

    const form = document.getElementById("formObrasSociales");
    const mensaje = document.getElementById("mensaje");
    const btnEliminar = document.getElementById("btnEliminar");

    const params = new URLSearchParams(window.location.search);
    const obraSocial = params.get("obraSocial");

    if (obraSocial) {
        editarObrasSociales(obraSocial);

        // Guardar cambios
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            guardarCambios();

            if (mensaje) {
                mensaje.classList.remove("d-none");
                setTimeout(() => mensaje.classList.add("d-none"), 3000);
            }
        });

        // Eliminar obra social
        if (btnEliminar) {
            btnEliminar.addEventListener("click", function () {
                if (confirm("¿Seguro que querés eliminar esta obra social?")) {
                    eliminarObraSocial(obraSocial);
                    alert("Obra social eliminada correctamente.");
                    window.location.href = "formularioMedicos.html";
                }
            });
        } else {
            return;
        }
    }

});