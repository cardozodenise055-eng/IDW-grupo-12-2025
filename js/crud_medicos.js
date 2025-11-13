const form = document.getElementById("formMedico");
const mensaje = document.getElementById("mensaje");
const selectOS = document.getElementById('obrasSociales');
const selectEspecialidades = document.getElementById('especialidades');

const usuario = sessionStorage.getItem("usuarioLogueado");

if (!usuario) {
    window.location.href = "login.html";
}

/* Funciones para buscar médicos */
function obtenerMedicos() {
    return JSON.parse(localStorage.getItem("medicos"));
}

function obtenerOS() {
    return JSON.parse(localStorage.getItem("obrasSociales"));
}

function obtenerEspecialidades() {
    return JSON.parse(localStorage.getItem("especialidades"));
}

/* Función para obtener el siguiente ID */
function obtenerSiguienteId() {
    const medicos = obtenerMedicos();

    if (medicos.length === 0) {
        return 1;
    }

    const ultimoID = medicos[medicos.length - 1];
    return ultimoID.id + 1;
}

/* Función para guardar médicos en LocalStorage */
function guardarMedicos(medicos) {
    localStorage.setItem("medicos", JSON.stringify(medicos));
}

/* Función para guardar médicos */
function agregarMedico(medico) {

    medico.id = obtenerSiguienteId();

    const medicos = obtenerMedicos();
    medicos.push(medico);
    guardarMedicos(medicos);

    document.getElementById("mensaje").classList.remove("d-none");

    console.log('Muestro en consola los medicos después de guardar el Nuevo', obtenerMedicos());
    window.location.href = "listarProfesionales.html";
}

function buscarMedicoPorDni(dni) {
    const medicos = obtenerMedicos();
    return medicos.find(m => m.dni === dni);
}

function actualizarMedico(dni, datosActualizados) {
    const medicos = obtenerMedicos();
    const indice = medicos.findIndex(m => m.dni === dni);

    if (indice !== -1) {
        medicos[indice] = {
            ...medicos[indice],
            ...datosActualizados
        };
        guardarMedicos(medicos);
        console.log("Médico actualizado correctamente:", medicos[indice]);
        window.location.href = "listarProfesionales.html";
    } else {
        console.log("No se encontró un médico con ese DNI.");
    }
}

function editarMedico(dni) {
    const medico = buscarMedicoPorDni(dni);

    if (medico) {
        console.log("Médico encontrado:", medico);
        document.getElementById("dni").value = medico.dni;
        document.getElementById("nombre").value = medico.nombre;
        document.getElementById("telefono").value = medico.telefono;
        document.getElementById("email").value = medico.email;
        document.getElementById("valor_consulta").value = medico.valor_consulta;
    } else {
        console.log("No se encontró un médico con ese DNI.");
        alert(`No se encontró un médico con ese DNI: ${dni}.`);
    }
}

function guardarCambios() {
    const dni = document.getElementById("dni").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const email = document.getElementById("email").value.trim();
    const valor_consulta = document.getElementById("valor_consulta").value.trim();

    const opcionesSeleccionadasOS = Array.from(selectOS.selectedOptions);

    const idsSeleccionadosOS = opcionesSeleccionadasOS.map(option => parseInt(option.value));

    const opcionesSeleccionadasEs = Array.from(selectEspecialidades.selectedOptions);

    const idsSeleccionadosEs = opcionesSeleccionadasEs.map(option => parseInt(option.value));

    const datosActualizados = {
        nombre,
        telefono,
        email,
        dni,
        especialidad: idsSeleccionadosEs,
        obraSocial: idsSeleccionadosOS,
        valor_consulta,
    };

    actualizarMedico(dni, datosActualizados);
}

/* Manejo del formulario */
function crearMedico(e) {
    e.preventDefault();

    console.log('Muestro en consola los medicos antes de guardar el Nuevo', obtenerMedicos());

    const archivo = document.getElementById("imagen").files[0];
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const email = document.getElementById("email").value.trim();
    const dni = document.getElementById("dni").value.trim();
    const valor_consulta = document.getElementById("valor_consulta").value.trim();

    const opcionesSeleccionadasOS = Array.from(selectOS.selectedOptions);

    const idsSeleccionadosOS = opcionesSeleccionadasOS.map(option => parseInt(option.value));

    const opcionesSeleccionadasEs = Array.from(selectEspecialidades.selectedOptions);

    const idsSeleccionadosEs = opcionesSeleccionadasEs.map(option => parseInt(option.value));


    if (!nombre || !telefono || !email || !dni || !idsSeleccionadosOS || !idsSeleccionadosEs) {
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
            `medico registrado:\n\n` +
            `nombre: ${nombre}\n` +
            `dni: ${dni}\n`
        );

        const nuevoMedico = {
            nombre: nombre,
            especialidad: idsSeleccionadosEs,
            telefono: telefono,
            email: email,
            dni: dni,
            obraSocial: idsSeleccionadosOS,
            valor_consulta: valor_consulta,
            imagen: imagenBase64
        };

        console.log(nuevoMedico);

        agregarMedico(nuevoMedico);

        form.reset();
    };

    lector.readAsDataURL(archivo);
}

if (form) {
    form.addEventListener("submit", crearMedico);
}

const cardMedicos = document.querySelector('#cardMedicos')

let flagIndex = null;

function actualizarTabla() {
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    cardMedicos.innerHTML = '';

    console.log(medicos)
    medicos.forEach(function (medico, index) {
        let fila = document.createElement('div');
        fila.classList.add('col');
        fila.innerHTML = `
            <div class="card h-100 profesional-card">
                <div class="card-body">
                    <h5 class="card-title">${medico.nombre}</h5>
                    <p class="card-text">${medico.especialidad}</p>
                    <p class="card-text">Tel.:${medico.telefono}</p>
                    <p class="card-text">E-mail:${medico.email}</p>
                    <a href="formularioMedicosEditar.html?dni=${medico.dni}" class="btn btn-primary">Editar</a>
                </div>
            </div>
        `;
        cardMedicos.appendChild(fila);
    })

}

document.addEventListener('DOMContentLoaded', () => {
    if (!sessionStorage.getItem('token')) {
        alert("Debe loguearse");
        window.location.href = '../login.html';
        return;
    }
})

if (cardMedicos) {
    actualizarTabla();
}

function eliminarMedico(dni) {
    const medicos = obtenerMedicos();
    const nuevosMedicos = medicos.filter(m => m.dni !== dni);

    if (nuevosMedicos.length === medicos.length) {
        console.log("No se encontró un médico con ese DNI.");
        return;
    }

    guardarMedicos(nuevosMedicos);
    console.log("Médico eliminado correctamente.");
}

window.addEventListener("DOMContentLoaded", () => {

    if (selectOS && selectEspecialidades) {
        const obrasSocialesJSON = obtenerOS();

        function llenarSelectObrasSociales() {
            obrasSocialesJSON.forEach(os => {
                const option = document.createElement('option');
                // Usamos el 'id' como valor y el 'Nombre' como texto visible
                option.value = os.id;
                option.textContent = os.Nombre + ' (' + os.Descripcion + ')';
                selectOS.appendChild(option);
            });
        }

        llenarSelectObrasSociales();


        const especialidadesJSON = obtenerEspecialidades();

        function llenarSelectEspecialidades() {
            especialidadesJSON.forEach(os => {
                const option = document.createElement('option');
                // Usamos el 'id' como valor y el 'Nombre' como texto visible
                option.value = os.id;
                option.textContent = os.Nombre;
                selectEspecialidades.appendChild(option);
            });
        }

        llenarSelectEspecialidades();
    }

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

    const form = document.getElementById("formMedico");
    const mensaje = document.getElementById("mensaje");
    const btnEliminar = document.getElementById("btnEliminar");

    const params = new URLSearchParams(window.location.search);
    const dni = params.get("dni");

    if (dni) {
        editarMedico(dni);

        // Guardar cambios
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            guardarCambios();

            if (mensaje) {
                mensaje.classList.remove("d-none");
                setTimeout(() => mensaje.classList.add("d-none"), 3000);
            }
        });

        // Eliminar médico
        if (btnEliminar) {
            btnEliminar.addEventListener("click", function () {
                if (confirm("¿Seguro que querés eliminar este médico?")) {
                    alert("Médico eliminado correctamente.");
                    eliminarMedico(dni);
                    window.location.href = "listarProfesionales.html";
                }
            });
        } else {
            return;
        }
    }
});