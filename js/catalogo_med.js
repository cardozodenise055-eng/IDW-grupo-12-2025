document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedor-catalogo")
  const medicos = JSON.parse(localStorage.getItem("medicos")) || []

  function obtenerObrasSociales() {
    return JSON.parse(localStorage.getItem("obrasSociales") || "[]");
  }

  const listaObrasSociales = obtenerObrasSociales();

  function obtenerNombresOS(arreglo) {
    if (!arreglo || arreglo.length === 0) {
      return "No especificada";
    }

    const nombres = arreglo.map(id => {
      const osEncontrada = listaObrasSociales.find(os => os.id === id);
      return osEncontrada ? osEncontrada.Nombre : `ID ${id} (Desconocida)`;
    });
    return nombres.join(", ");
  }

  function obtenerEspecialidades() {
    return JSON.parse(localStorage.getItem("especialidades") || "[]");
  }

  const listaEspecialidades = obtenerEspecialidades();

  function obtenerNombresEs(arreglo) {
    if (!arreglo || arreglo.length === 0) {
      return "No especificada";
    }

    const nombres = arreglo.map(id => {
      const esEncontrada = listaEspecialidades.find(es => es.id === id);
      return esEncontrada ? esEncontrada.Nombre : `ID ${id} (Desconocida)`;
    });
    return nombres.join(", ");
  }

  medicos.forEach(medico => {
    const nombresOS = obtenerNombresOS(medico.obraSocial);
    const nombresES = obtenerNombresEs(medico.especialidad);
    const tarjeta = document.createElement("div")
    tarjeta.className = "col-12 col-md-6 col-lg-4 d-flex"

    tarjeta.innerHTML = `
      <div class="profesional-card card w-100">
        <img src="${medico.imagen}" class="card-img-top" alt="${medico.nombre}">
        <div class="card-body">
          <h3 class="card-title">${medico.nombre}</h3>
          <p class="card-text">Especialidad: ${nombresES}</p>
          <p class="card-text">Teléfono: ${medico.telefono}</p>
          <p class="card-text">Email: ${medico.email}</p>
          <a href="#" class="btn btn-primary">Obra social: ${nombresOS}</a>
        </div>
      </div>`

    contenedor.appendChild(tarjeta)
  })
})