
const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
const obraSociales = JSON.parse(localStorage.getItem("obrasSociales")) || [];

const selectEspecialidad = document.getElementById("selectEspecialidad");
const selectMedico = document.getElementById("selectMedico");
const selectOS = document.getElementById("selectOS");
const precioMedicoP = document.getElementById("precioMedico");

const getMedicoDNI = (m) => m.dni ?? m.DNI ?? null;

function obtenerEspecialidades() {
  return JSON.parse(localStorage.getItem("especialidades"));
}

const getMedicoNombreDisplay = (m) => {
  if (m.Apellido && m.Nombre) return `${m.Apellido} ${m.Nombre}`;
  if (m.apellido && m.nombre) return `${m.apellido} ${m.nombre}`;
  if (m.nombre) return m.nombre;
  if (m.Nombre) return m.Nombre;
  return "Médico sin nombre";
};

const getMedicoEspecialidad = (m) => m.especialidad ?? m.Especialidad ?? m.specialty ?? "";

function cargarEspecialidadesDesdeMedicos() {
  if (!selectEspecialidad) return;

  const especialidadesJSON = obtenerEspecialidades();

  selectEspecialidad.innerHTML = `<option value="">Seleccione una especialidad...</option>`;

  especialidadesJSON.forEach((esp) => {
    console.log(esp);
    const opt = document.createElement("option");
    opt.value = esp.id;
    opt.textContent = esp.Nombre;
    selectEspecialidad.appendChild(opt);
  });

  if (especialidadesJSON.length === 0) {
    selectEspecialidad.innerHTML = `<option value="">No hay especialidades cargadas</option>`;
  }
}

function filtrarMedicos() {
  if (!selectMedico) return;

  const especialidadSeleccionada = parseInt(selectEspecialidad.value);
  selectMedico.innerHTML = `<option value="">Seleccione un médico...</option>`;

  if (!especialidadSeleccionada) return;

  const medicosFiltrados = medicos.filter(medico => {
    return medico.especialidad && medico.especialidad.includes(especialidadSeleccionada);
  });
  console.log(medicosFiltrados);

  if (medicosFiltrados.length === 0) {
    selectMedico.innerHTML = `<option value="">No hay médicos para esta especialidad</option>`;
    return;
  }

  medicosFiltrados.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m.id; 
    opt.textContent = `${getMedicoNombreDisplay(m)}`;
    selectMedico.appendChild(opt);
  });

  if (precioMedicoP) precioMedicoP.textContent = "";
}

function buscarMedico(id) {
  // Usamos find() para iterar sobre el arreglo y detenernos en el primer elemento
  // donde el id del médico coincida con el id buscado.
  return medicos.find(medico => medico.id === id);
}

function filtrarObraSocial() {

  if (!selectOS) return;

  mostrarTurnosDisponibles();

  const IDmedicoSeleccionado = parseInt(selectMedico.value);
  selectOS.innerHTML = `<option value="">Seleccione una Obra Social...</option>`;

  if (!IDmedicoSeleccionado) return;

  const medicoSeleccionado = buscarMedico(IDmedicoSeleccionado);
  const idsOSAtendidosPorMedico = medicoSeleccionado.obraSocial;

  const obrasSocialesFiltradas = obraSociales.filter(os => {
    return idsOSAtendidosPorMedico.includes(os.id);
  });
  console.log(obrasSocialesFiltradas);

  if (obrasSocialesFiltradas.length === 0) {
    selectOS.innerHTML = `<option value="">No hay OS para este Medico</option>`;
    return;
  }

  obrasSocialesFiltradas.forEach((os) => {
    const opt = document.createElement("option");
    opt.value = os.id;
    opt.textContent = `${os.Nombre} (${os.Descripcion})`;
    selectOS.appendChild(opt);
  });

  if (precioMedicoP) precioMedicoP.textContent = "";
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

  const idMedico = selectMedico.value;
  if (!idMedico) return;

  console.log('139', idMedico);

  const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
  const reservasMedico = turnos.filter(t => t.medicoId == idMedico);

  console.log('144', reservasMedico)

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
