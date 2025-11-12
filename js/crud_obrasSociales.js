const form = document.getElementById("formObrasSociales");
const mensaje = document.getElementById("mensaje");
const tablaObrasSociales = document.getElementById("tabla-obrassociales");

const usuario = sessionStorage.getItem("usuarioLogueado");

if (!usuario) {
    window.location.href = "login.html";
}

function obtenerObrasSociales() {
    return JSON.parse(localStorage.getItem("obrasSociales") || "[]");
}

console.log(obtenerObrasSociales());

function obtenerSiguienteId() {
    const obrasSociales = obtenerObrasSociales();

    if (obrasSociales.length === 0) {
        return 1;
    }

    const ultimoID = obrasSociales[obrasSociales.length - 1];
    return ultimoID.id + 1;
}

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

function buscarObraSocialporid(id) {
    const obrasSociales = obtenerObrasSociales();
    return obrasSociales.find(o => o.id === id);
}

function actualizarObraSocial(id, datosActualizados) {

    const obrasSociales = obtenerObrasSociales();
    const indice = obrasSociales.findIndex(o => o.id == id);

    if (indice !== -1) {
        obrasSociales[indice] = {
            ...obrasSociales[indice],
            ...datosActualizados
        };
        guardarObrasSociales(obrasSociales);
        console.log("Obra social actualizada correctamente:", obrasSociales[indice]);

        mostrarObrasSociales();
        form.reset();
        form.querySelector("button[type='submit']").textContent = "Guardar Obra Social"

    } else {

        console.log("No se encontró una obra social con ese id.");
    }
}

function editarObraSocial(id) {
    const obraSocial = buscarObraSocialporid(id);

    if (obraSocial) {
        document.getElementById("id").value = obraSocial.id;
        document.getElementById("nombre").value = obraSocial.nombre;
        document.getElementById("descripcion").value = obraSocial.descripcion;
        form.querySelector("button[type='submit']").textContent = "Guardar cambios"

    } else {
        console.log("No se encontró una obra social con ese id.");
        alert(`No se encontró una obra social con ese id: ${id}.`);
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

    actualizarObraSocial(id, datosActualizados);
}

function crearObraSocial(e) {
    e.preventDefault();

    if (form.querySelector("button[type='submit']").textContent === "Guardar cambios") {
        guardarCambios();
        return;
    }

    console.log('Muestro en consola las obras sociales antes de guardar el Nuevo', obtenerObrasSociales() || []);

    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    if (!nombre || !descripcion) {
        alert('Por favor completa los campos requeridos');
        return;
    }

    const nuevaObraSocial = {
        nombre: nombre,
        descripcion: descripcion
    };

    agregarObraSocial(nuevaObraSocial);

    form.reset();

    mostrarObrasSociales();
};

if (form) {
    form.addEventListener("submit", crearObraSocial);
}

function eliminarObraSocial(id) {
    console.log(id)
    const obrasSociales = obtenerObrasSociales();
    const nuevasObrasSociales = obrasSociales.filter(o => o.id !== id);

    if (nuevasObrasSociales.length === obrasSociales.length) {
        console.log("No se encontró una obra social con ese id.");
        return;
    }

    guardarObrasSociales(nuevasObrasSociales);
    console.log("Obra social eliminada correctamente.");

    mostrarObrasSociales();
}

function mostrarObrasSociales() {
    const obrasSociales = obtenerObrasSociales();

    tablaObrasSociales.innerHTML = ""
    obrasSociales.forEach((os, index) => {
        const fila = document.createElement("tr")

        fila.innerHTML = `
            <td>${os.id}</td>
            <td>${os.nombre}</td>
            <td>${os.descripcion}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="eliminarObraSocial(${os.id})">Eliminar</button>
                <button class="btn btn-primary btn-sm" onclick="editarObraSocial(${os.id})">Editar</button>
            </td>`

    tablaObrasSociales.appendChild(fila)
    })
}

window.addEventListener("DOMContentLoaded", () => {

    if (!sessionStorage.getItem('token')) {
        alert("Debe loguearse");
        window.location.href = '../login.html';
        return;
    }

    mostrarObrasSociales()

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