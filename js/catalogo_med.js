document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedor-catalogo")
  const medicos = JSON.parse(localStorage.getItem("medicos")) || []

  medicos.forEach(medico => {
    const tarjeta = document.createElement("div")
    tarjeta.className = "col-12 col-md-6 col-lg-4 d-flex"

    tarjeta.innerHTML = `
      <div class="card w-100">
        <img src="${medico.imagen}" class="card-img-top" alt="${medico.nombre}">
        <div class="card-body">
          <h3 class="card-title">${medico.nombre}</h3>
          <p class="card-text">Especialidad: ${medico.especialidad}</p>
          <p class="card-text">Teléfono: ${medico.telefono}</p>
          <p class="card-text">Email: ${medico.email}</p>
          <a href="#" class="btn btn-primary">Obra social: ${medico.obraSocial}</a>
        </div>
      </div>`

    contenedor.appendChild(tarjeta)
  })
})