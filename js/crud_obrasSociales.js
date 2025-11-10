const form = document.getElementById("formObrasSociales");
const mensaje = document.getElementById("mensaje");

const id = sessionStorage.getItem("idLogueado");

/* Función para guardar obras sociales en LocalStorage */

function obtenerObrasSociales() {
    return JSON.parse(localStorage.getItem("obrasSociales"));
}

/* Función para obtener el siguiente ID */
function obtenerSiguienteId() {
    const obrasSociales = obtenerObrasSociales();
    const ultimoID = obrasSociales[obrasSociales.length - 1];
    return ultimoID.id + 1;
}

/* Función para guardar obras sociales */
function guardarObrasSociales(obrasSociales) {
    localStorage.setItem("obrasSociales", JSON.stringify(obrasSociales));
}

function agregarObraSocial(obraSocial) {

    obraSocial.id = obtenerSiguienteId();

    const obrasSociales = obtenerObrasSociales();
    obrasSociales.push(obraSocial);
    guardarObrasSociales(obrasSociales);

    document.getElementById("mensaje").classList.remove("d-none");

    console.log('Muestro en consola las obras sociales después de guardar el Nuevo', obtenerObrasSociales());
}

function buscarporid(id) {
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
        console.log("obra social actualizada correctamente:", obrasSociales[indice]);
        window.location.href = "listarProfesionales.html";
    } else {
        console.log("No se encontró una obra social con ese id.");
    }
}

function editarObraSocial(id) {
    const obraSocial = buscarporid(id);

    if (obraSocial) {
        document.getElementById("nombre").value = obraSocial.nombre;
        document.getElementById("id").value = obraSocial.id;
    
    } else {
        console.log("No se encontró una obra social con ese id.");
        alert(`No se encontró una obra social con el id: ${id}.`);
    }
}

function guardarCambios() {
    const nombre = document.getElementById("nombre").value.trim();
    const id = document.getElementById("id").value.trim();

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
    const id = document.getElementById("id").value.trim();
  

    if (!id || !nombre ) {
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
            `obra social registrada:\n\n` +
            `nombre: ${nombre}\n` +
            `id: ${id}\n`
        );

        const nuevasObrasSociales = {
            nombre: nombre,
            id: id,
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

function actualizarTabla() {
    let obrasSociales = JSON.parse(localStorage.getItem('obras sociales')) || [];
    cardObrasSociales.innerHTML = '';

    console.log(obrasSociales)
    obrasSociales.forEach(function (obraSocial, index) {
        let fila = document.createElement('div');
        fila.classList.add('col');
        fila.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${obraSocial.nombre}</h5>
                    <a href="ObrasSociales.html?dni=${obraSocial.id}" class="btn btn-primary">Editar</a>
                </div>
            </div>
        `;
        cardObrasSociales.appendChild(fila);
    })
}



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
    console.log("Obra Social eliminada correctamente.");
}

window.addEventListener("DOMContentLoaded", () => {
    
 /* session */
    const navSesion = document.getElementById("navSesion");
    const id = sessionStorage.getItem("idLogueado");

    if (id){
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
                    eliminarObraSocial(obraSocial);
                    alert("Obra social eliminada correctamente.");
                    window.location.href = "ObrasSociales.html";
                }
            });
        } else {
            return;
        }
    }

});