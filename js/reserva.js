const medicos = JSON.parse(localStorage.getItem("medicos")) || [];

/* Referencias a selects */
const selectEspecialidad = document.getElementById("selectEspecialidad");
const selectMedico = document.getElementById("selectMedico");
const precioMedicoP = document.getElementById("precioMedico");

/* --- Utilidades para normalizar campos (para ser tolerante con distintos formatos) --- */
const getMedicoId = (m) => m.id ?? m.dni ?? m.DNI ?? m.dniMedico ?? null;
const getMedicoNombreDisplay = (m) => {
  // Priorizar Apellido + Nombre si existen, si no usar nombre
  if (m.Apellido && m.Nombre) return `${m.Apellido} ${m.Nombre}`;
  if (m.apellido && m.nombre) return `${m.apellido} ${m.nombre}`;
  if (m.nombre) return m.nombre;
  if (m.Nombre) return m.Nombre;
  return "Médico sin nombre";
};
const getMedicoEspecialidad = (m) =>
  m.especialidad ?? m.Especialidad ?? m.specialty ?? "";

/* --- Cargar especialidades únicas en el select --- */
function cargarEspecialidadesDesdeMedicos() {
  if (!selectEspecialidad) return;

  // obtener todas las especialidades (normalizadas)
  const especialidades = Array.from(
    new Set(medicos.map((m) => getMedicoEspecialidad(m)).filter((s) => s))
  );

  // limpiar y poner opción por defecto
  selectEspecialidad.innerHTML = `<option value="">Seleccione una especialidad...</option>`;

  especialidades.forEach((esp) => {
    const opt = document.createElement("option");
    opt.value = esp;
    opt.textContent = esp;
    selectEspecialidad.appendChild(opt);
  });

  // si no hay especialidades, avisar
  if (especialidades.length === 0) {
    selectEspecialidad.innerHTML = `<option value="">No hay especialidades cargadas</option>`;
  }
}

/* --- Filtrar médicos por especialidad y poblar selectMedico --- */
function filtrarMedicos() {
  if (!selectMedico) return;

  const especialidadSeleccionada = selectEspecialidad.value;
  selectMedico.innerHTML = `<option value="">Seleccione un médico...</option>`;

  if (!especialidadSeleccionada) return;

  // filtrar los médicos que pertenezcan a la especialidad seleccionada
  const medicosFiltrados = medicos.filter(
    (m) => getMedicoEspecialidad(m) === especialidadSeleccionada
  );

  if (medicosFiltrados.length === 0) {
    selectMedico.innerHTML = `<option value="">No hay médicos para esta especialidad</option>`;
    return;
  }

  medicosFiltrados.forEach((m) => {
    const opt = document.createElement("option");
    // valor: preferimos dni (si tu CRUD usa dni), sino id
    opt.value = getMedicoId(m) || getMedicoNombreDisplay(m);
    opt.textContent = `${getMedicoNombreDisplay(m)}${m.obraSocial ? " — " + m.obraSocial : ""}`;
    selectMedico.appendChild(opt);
  });

  // limpiar precio cuando cambie la especialidad
  if (precioMedicoP) precioMedicoP.textContent = "";
}

/* --- Mostrar precio u otra info del médico seleccionado (opcional) --- */
function mostrarPrecio() {
  const valor = selectMedico.value;
  if (!valor) {
    if (precioMedicoP) precioMedicoP.textContent = "";
    return;
  }

  // buscar médico por dni o id
  const medico = medicos.find((m) => {
    const id = String(getMedicoId(m));
    return id === String(valor);
  });

  if (!medico) {
    if (precioMedicoP) precioMedicoP.textContent = "";
    console.warn("medico no encontrado para mostrar precio:", valor);
    return;
  }

  // distintos nombres posibles para precio según cómo lo guardes
  const precio = medico.precio ?? medico.Valor ?? medico.Valor_Total ?? medico.valor ?? medico.price ?? null;
  if (precio != null) {
    precioMedicoP.textContent = `Precio: $${precio}`;
  } else {
    precioMedicoP.textContent = "Precio: (no definido)";
  }
}

/* --- Iniciar: cargar especialidades al cargar la página --- */
document.addEventListener("DOMContentLoaded", () => {
  cargarEspecialidadesDesdeMedicos();
});
