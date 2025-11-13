const cargarReservas = () => {
  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  console.log("reservas", reservas);
  const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
  console.log("turnos", turnos);
  const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
  console.log("medicos", medicos);
  const especialidades =
    JSON.parse(localStorage.getItem("especialidades")) || [];
  console.log("especialidades", especialidades);

  const cuerpo = document.getElementById("cuerpoTabla");
  cuerpo.innerHTML = "";

  if (reservas.length == 0) {
    console.log("cargando reservas");
    document.getElementById("sinDatos").classList.remove("d-none");
    return;
  }

  document.getElementById("sinDatos").classList.add("d-none");

  reservas.forEach((reserva) => {
    const turno = turnos.find((t) => t.id == reserva.turno);
    const medico = medicos.find((m) => m.id == turno?.medicoId);
    const especialidad = especialidades.find((e) => e.id == reserva.especialidad);

    console.log("turno", turno);
    console.log("medico", medico);
    console.log("especialidad", especialidad);

    if (!turno || !medico || !especialidad) return;

    const fila = document.createElement("tr");

    fila.innerHTML = `
          <td><strong>${reserva.documento}</strong></td>
          <td>${reserva.Apellido_y_Nombre}</td>
          <td>${medico.nombre}</td>
          <td>${especialidad.Nombre}</td>
          <td>${formatearFecha(turno.fechaHora)}</td>
          <td><span class="badge bg-success">$ ${
            reserva.valorTotal
          }</span></td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="cancelarReserva(${
              reserva.id
            }, ${turno.id})">
              Cancelar
            </button>
          </td>
        `;
    cuerpo.appendChild(fila);
  });
};

const cancelarReserva = (reservaId, turnoId) => {
  if (!confirm("¿Cancelar esta reserva? El turno quedará libre.")) return;

  let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

  // Borrar reserva
  reservas = reservas.filter((r) => r.id != reservaId);
  localStorage.setItem("reservas", JSON.stringify(reservas));

  // Liberar turno
  const turno = turnos.find((t) => t.id == turnoId);
  if (turno) {
    turno.disponible = true;
    localStorage.setItem("turnos", JSON.stringify(turnos));
  }

  alert("Reserva cancelada y turno liberado");
  cargarReservas();
};

const filtrarReservas = () => {
  const filtro = document
    .getElementById("filtroDni")
    .value.trim()
    .toLowerCase();
  const filas = document.querySelectorAll("#cuerpoTabla tr");

  filas.forEach((fila) => {
    const dni = fila.cells[0].textContent.toLowerCase();
    fila.style.display = dni.includes(filtro) ? "" : "none";
  });
};

const formatearFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);
  return (
    fecha.toLocaleDateString("es-AR") +
    " " +
    fecha.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

window.onload = cargarReservas;
