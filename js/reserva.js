
const medicos = JSON.parse(localStorage.getItem("medicos")) || [];

const selectEspecialidad = document.getElementById("selectEspecialidad");
const selectMedico = document.getElementById("selectMedico");
const precioMedicoP = document.getElementById("precioMedico");

const getMedicoDNI = (m) => m.dni ?? m.DNI ?? null;

const getMedicoNombreDisplay = (m) => {
  if (m.Apellido && m.Nombre) return `${m.Apellido} ${m.Nombre}`;
  if (m.apellido && m.nombre) return `${m.apellido} ${m.nombre}`;
  if (m.nombre) return m.nombre;
  if (m.Nombre) return m.Nombre;
  return "Médico sin nombre";
};

const getMedicoEspecialidad = (m) =>
  m.especialidad ?? m.Especialidad ?? m.specialty ?? "";

function cargarEspecialidadesDesdeMedicos() {
  if (!selectEspecialidad) return;

  const especialidades = Array.from(
    new Set(medicos.map((m) => getMedicoEspecialidad(m)).filter((s) => s))
  );

  selectEspecialidad.innerHTML = `<option value="">Seleccione una especialidad...</option>`;

  especialidades.forEach((esp) => {
    const opt = document.createElement("option");
    opt.value = esp;
    opt.textContent = esp;
    selectEspecialidad.appendChild(opt);
  });

  if (especialidades.length === 0) {
    selectEspecialidad.innerHTML = `<option value="">No hay especialidades cargadas</option>`;
  }
}

function filtrarMedicos() {
  if (!selectMedico) return;

  const especialidadSeleccionada = selectEspecialidad.value;
  selectMedico.innerHTML = `<option value="">Seleccione un médico...</option>`;

  if (!especialidadSeleccionada) return;

  const medicosFiltrados = medicos.filter(
    (m) => getMedicoEspecialidad(m) === especialidadSeleccionada
  );

  if (medicosFiltrados.length === 0) {
    selectMedico.innerHTML = `<option value="">No hay médicos para esta especialidad</option>`;
    return;
  }

  medicosFiltrados.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = getMedicoDNI(m); // 👈 usamos el DNI como identificador
    opt.textContent = `${getMedicoNombreDisplay(m)}${m.obraSocial ? " — " + m.obraSocial : ""}`;
    selectMedico.appendChild(opt);
  });

  if (precioMedicoP) precioMedicoP.textContent = "";
}
function mostrarPrecio() {
  const dniMedico = selectMedico.value;
  if (!dniMedico) {
    if (precioMedicoP) precioMedicoP.textContent = "";
    return;
  }

  const medico = medicos.find((m) => String(getMedicoDNI(m)) === String(dniMedico));

  if (!medico) {
    if (precioMedicoP) precioMedicoP.textContent = "";
    console.warn("Médico no encontrado:", dniMedico);
    return;
  }

  const precio = medico.precio ?? medico.valor ?? medico.Valor ?? medico.price ?? null;
  precioMedicoP.textContent = precio != null ? `Precio: $${precio}` : "Precio: (no definido)";

  mostrarTurnosDisponibles();
}

function generarPosiblesTurnos(dias = 7) {
  const franjas = ["09:00", "10:00", "11:00", "14:00", "15:00"];
  const turnos = [];
  const hoy = new Date();

  for (let i = 0; i < dias; i++) {
    const dia = new Date(hoy);
    dia.setDate(hoy.getDate() + i);
    if (dia.getDay() === 0 || dia.getDay() === 6) continue;

    const yyyy = dia.getFullYear();
    const mm = String(dia.getMonth() + 1).padStart(2, "0");
    const dd = String(dia.getDate()).padStart(2, "0");

    franjas.forEach((h) => turnos.push(`${yyyy}-${mm}-${dd} ${h}`));
  }
  return turnos;
}

function mostrarTurnosDisponibles() {
  const selectTurno = document.getElementById("selectTurno");
  if (!selectTurno) return;
  selectTurno.innerHTML = `<option value="">Seleccione día y hora...</option>`;

  const dniMedico = selectMedico.value;
  if (!dniMedico) return;

  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  const reservasMedico = reservas.filter(
    (r) => String(r.dniMedico) === String(dniMedico)
  );

  const posiblesTurnos = generarPosiblesTurnos(7);

  const turnosDisponibles = posiblesTurnos.filter(
    (t) => !reservasMedico.some((r) => r.fecha === t)
  );

  if (turnosDisponibles.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No hay turnos disponibles";
    selectTurno.appendChild(opt);
    return;
  }

  turnosDisponibles.forEach((turno) => {
    const opt = document.createElement("option");
    opt.value = turno;
    opt.textContent = turno.replace(" ", " — ");
    selectTurno.appendChild(opt);
  });
}
function reservarTurno() {
  const dniMedico = selectMedico.value;
  const turno = document.getElementById("selectTurno").value;
  const obraSocial = document.getElementById("obraSocial").value.trim().toUpperCase();
  const dniPaciente = document.getElementById("dni").value.trim();
  const nombrePaciente = document.getElementById("nombre").value.trim();

  if (!dniMedico || !turno || !obraSocial || !dniPaciente || !nombrePaciente) {
    alert("Por favor, complete todos los campos antes de reservar.");
    return;
  }

  const medico = medicos.find((m) => String(getMedicoDNI(m)) === String(dniMedico));
  if (!medico) {
    alert("Error: médico no encontrado.");
    return;
  }

  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

  const ocupado = reservas.some(
    (r) => r.dniMedico === dniMedico && r.fecha === turno
  );
  if (ocupado) {
    alert("Ese turno ya fue reservado. Seleccione otro.");
    mostrarTurnosDisponibles();
    return;
  }

  const nuevaReserva = {
    dniMedico,
    medicoNombre: getMedicoNombreDisplay(medico),
    especialidad: getMedicoEspecialidad(medico),
    pacienteDNI: dniPaciente,
    pacienteNombre: nombrePaciente,
    obraSocial,
    fecha: turno,
    precio: medico.precio ?? medico.valor ?? medico.Valor ?? medico.price ?? "—"
  };

  reservas.push(nuevaReserva);
  localStorage.setItem("reservas", JSON.stringify(reservas));

  mostrarTicket(nuevaReserva);
  mostrarTurnosDisponibles();
}
function mostrarTicket(reserva) {
  const detalle = document.getElementById("detalleTicket");
  if (!detalle) return;

  detalle.innerHTML = `
    <p><strong>Médico:</strong> ${reserva.medicoNombre}</p>
    <p><strong>Especialidad:</strong> ${reserva.especialidad}</p>
    <p><strong>Fecha y hora:</strong> ${reserva.fecha}</p>
    <p><strong>Paciente:</strong> ${reserva.pacienteNombre}</p>
    <p><strong>DNI:</strong> ${reserva.pacienteDNI}</p>
    <p><strong>Obra social:</strong> ${reserva.obraSocial}</p>
    <p><strong>Precio:</strong> ${reserva.precio !== "—" ? "$" + reserva.precio : "—"}</p>
  `;

  const modal = new bootstrap.Modal(document.getElementById("modalTicket"));
  modal.show();
}
document.addEventListener("DOMContentLoaded", () => {
  cargarEspecialidadesDesdeMedicos();
});
