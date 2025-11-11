const form = document.getElementById("formObrasSociales");
const mensaje = document.getElementById("mensaje");

const usuario = sessionStorage.getItem("usuarioLogueado");

if (!usuario) {
    window.location.href = "login.html";
}

/* Funciones para buscar obras sociales */
function obtenerObrasSociales() {
    return JSON.parse(localStorage.getItem("obrasSociales"));
}

/* Función para obtener el siguiente ID */
function obtenerSiguienteId() {
    const obrasSociales = obtenerObrasSociales();
    const ultimoID = obrasSociales[obrasSociales.length - 1];
    return ultimoID.id + 1;
}

/* Función para guardar obras sociales en LocalStorage */
function guardarObrasSociales(obrasSociales) {
    localStorage.setItem("obrasSociales", JSON.stringify(obrasSociales));
}

/* Función para guardar obras sociales */
function agregarObraSocial(obraSocial) {

    obraSocial.id = obtenerSiguienteId();

    const obrasSociales = obtenerObrasSociales();
    obrasSociales.push(obraSocial);
    guardarObrasSociales(obrasSociales);

    document.getElementById("mensaje").classList.remove("d-none");

    console.log('Muestro en consola las obras sociales después de guardar el Nuevo', obtenerObrasSociales());
    window.location.href = "listarProfesionales.html";
}

function buscarObraSocialporid(id) {
    const obrasSociales = obtenerObrasSociales();
    return obrasSociales.find(o => o.id === id);
}

function actualizarObraSocial(id, datosActualizados) {
    const obrasSociales = obtenerObrasSociales();
    const indice = obrasSociales.findIndex(o => o.id === id);

    if (indice !== -1) {
        obrasSociales[indice] = {
            ...obrasSociales[indice],
            ...datosActualizados
        };
        guardarObrasSociales(obrasSociales);
        console.log("Obra social actualizada correctamente:", obrasSociales[indice]);
        window.location.href = "listarProfesionales.html";
    } else {
        console.log("No se encontró una obra social con ese id.");
    }
}

function editarObraSocial(id) {
    const obraSocial = buscarObraSocialporid(id);

    if (obraSocial) {
        document.getElementById("id").value = obraSocial.id;
        document.getElementById("nombre").value = obraSocial.nombre;
       
    } else {
        console.log("No se encontró una obra social con ese id.");
        alert(`No se encontró una obra social con ese id: ${id}.`);
    }
}

function guardarCambios() {
    const id = document.getElementById("id").value.trim();
    const nombre = document.getElementById("nombre").value.trim();


    const datosActualizados = {
        nombre,
        id,
    };

    actualizarObraSocial(id, datosActualizados);
}
/* Manejo del formulario */
function crearObraSocial(e) {
    e.preventDefault();

    console.log('Muestro en consola las obras sociales antes de guardar el Nuevo', obtenerObrasSociales());

    const nombre = document.getElementById("nombre").value.trim();

    if (!nombre) {
        alert('Por favor completa los campos requeridos');
        return;
    }



        alert(
            `obra social registrada:\n\n` +
            `nombre: ${nombre}\n`
           
           
        );

        const nuevaObraSocial = {
            nombre: nombre,
            id: id,
        
        };

        agregarObraSocial(nuevaObraSocial);

        form.reset();
    };


if (form) {
    form.addEventListener("submit", crearObraSocial);
}

const cardObrasSociales = document.querySelector('#cardObrasSociales')

let flagIndex = null;

function actualizarTabla() {
    let obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
    cardObrasSociales.innerHTML = '';

    console.log(obrasSociales)
    obrasSociales.forEach(function (obraSocial, index) {
        let fila = document.createElement('div');
        fila.classList.add('col');
        fila.innerHTML = `
            <div class="card h-100 profesional-card">
                <div class="card-body">
                    <h5 class="card-title">${obraSocial.nombre}</h5>
                    <p class="card-text">${obraSocial.descripcion}</p>
                    <a href="formularioMedicosEditar.html?id=${obraSocial.id}" class="btn btn-primary">Editar</a>
                </div>
            </div>
        `;
        cardObrasSociales.appendChild(fila);
    })

}

document.addEventListener('DOMContentLoaded',() =>{
    if(!sessionStorage.getItem('token')){
        alert("Debe loguearse");
        window.location.href='../login.html';
        return;
    }
})

if (cardObrasSociales) {
    actualizarTabla();
}

function eliminarObraSocial(id) {
    const obrasSociales = obtenerObrasSociales();
    const nuevasObrasSociales = obrasSociales.filter(o => o.id !== id);

    if (nuevasObrasSociales.length === obrasSociales.length) {
        console.log("No se encontró una obra social con ese id.");
        return;
    }

    guardarObrasSociales(nuevasObrasSociales);
    console.log("Obra social eliminada correctamente.");
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
    const id = params.get("id");

    if (id) {
        editarObraSocial(id);

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
                    eliminarObraSocial(id);
                    alert("Obra social eliminada correctamente.");
                    window.location.href = "formularioMedicos.html";
                }
            });
        } else {
            return;
        }
    }
});