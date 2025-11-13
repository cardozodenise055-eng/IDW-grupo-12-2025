
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

function filtrarObraSocialyTurnos() {

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

  document.getElementById("costo").value = medicoSeleccionado.valor_consulta
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
  const turnosDelMedico = turnos.filter(t => t.medicoId == idMedico);

  console.log('144', turnosDelMedico)

  if (turnosDelMedico.length === 0) {
    selectOS.innerHTML = `<option value="">No hay Turnos para este Medico</option>`;
    return;
  }

  turnosDelMedico.forEach((t) => {
    if(t.disponible){
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = `${t.fechaHora.replace("T", " ") + "hs"}`;
    selectTurno.appendChild(opt);
  }
  });
}

function obtenerSiguienteId(R) {

  if (R.length === 0) {
    return 1;
  }

  const ultimoID = R[R.length - 1];
  return ultimoID.id + 1;
}

function reservarTurno() {

  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

  const dniPaciente = document.getElementById("dni").value.trim();
  const nombrePaciente = document.getElementById("nombre").value.trim();
  const selectTurno = document.getElementById("selectTurno").value;
  const selectEspecialidad = document.getElementById("selectEspecialidad").value;
  const selectOS = document.getElementById("selectOS").value;
  const costo = document.getElementById("costo").value;
  const descuentos = document.getElementById("descuentos").value;

  if (
    !dniPaciente ||
    !nombrePaciente ||
    !selectTurno ||
    !selectEspecialidad ||
    !selectOS
  ) {
    alert("Por favor, complete todos los campos antes de reservar.");
    return;
  }
  
  const nuevaReserva = {
    id: obtenerSiguienteId(reservas),
    documento: dniPaciente,
    apellidoNombre: nombrePaciente,
    turno: parseInt(selectTurno),
    especialidad: parseInt(selectEspecialidad),
    obraSocial: parseInt(selectOS),
    valorTotal: costo - (costo * descuentos / 100),  
  };

  console.log(nuevaReserva)

  if(reservas.length > 0){

    const ocupado = reservas.some(
      (r) => r.turno == selectTurno
    );

    if (ocupado) {
      alert("Ese turno ya fue reservado. Seleccione otro.");
      return;
    }
  }

  reservas.push(nuevaReserva);
  localStorage.setItem("reservas", JSON.stringify(reservas));

  alert("Reserva realizada con exito");

  window.location.href = "reservas.html";

  /* mostrarTicket(nuevaReserva); */
}

/* function mostrarTicket(reserva) {
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
} */

document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("reservas");
  cargarEspecialidadesDesdeMedicos();
});
