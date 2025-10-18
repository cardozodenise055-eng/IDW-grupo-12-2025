const form = document.getElementById("formMedico");
const mensaje = document.getElementById("mensaje");

/* Funciones para buscar médicos */
function obtenerMedicos() {
    return JSON.parse(localStorage.getItem("medicos"));
}

/* Función para obtener el siguiente ID */
function obtenerSiguienteId() {
    const medicos = obtenerMedicos();
    const ultimoID = medicos[medicos.length - 1]; // toma el último médico del array
    return ultimoID.id + 1; // siguiente ID
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

    console.log('Muestro en consola los medicos después de guardar el Nuevo', obtenerMedicos());
}

/* Manejo del formulario */
function crearMedico(e) {
    e.preventDefault();

    console.log('Muestro en consola los medicos antes de guardar el Nuevo', obtenerMedicos());

    const nombre = document.getElementById("nombre").value.trim();
    const especialidad = document.getElementById("especialidad").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const email = document.getElementById("email").value.trim();
    const obraSocial = document.getElementById("obraSocial").value.trim();

    const nuevoMedico = {
        nombre: nombre,
        especialidad: especialidad,
        telefono: telefono,
        email: email,
        obraSocial: obraSocial
    }

    agregarMedico(nuevoMedico);
}

form.addEventListener("submit", crearMedico)