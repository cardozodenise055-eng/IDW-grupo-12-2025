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

    if(!nombre || !especialidad || !obraSocial){
    alert('Por favor completa los campos requeridos');
    return;
}
    alert(
    `medico registrado:\n\n` +
    `nombre: ${nombre}\n` +
    `especialidad: ${especialidad}\n` +
    `obrasocial: ${obraSocial}\n`
);

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

const tablaMedicosBody = document.querySelector('#tablaMedicos tbody')

let flagIndex = null;
function actualizarTabla(){
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    tablaMedicosBody.innerHTML = '';

    console.log(medicos)
    medicos.forEach(function(medico, index)  {
        let fila = document.createElement('tr');
        fila.innerHTML = `
        <td>${medico.nombre}</td>
        <td>${medico.especialidad}</td>
        <td>${medico.telefono}</td>
        <td>${medico.obraSocial}</td>
        <td>${medico.email}</td>
        <td>
        <a href="formulariomedicoseditar.html?dni=${medico.dni}" class="btn btn-sm btn-warning me-2 btn-editar">Editar </button>
       
        </td>
        `;
        tablaMedicosBody.appendChild(fila);

    })
    
}
actualizarTabla();
