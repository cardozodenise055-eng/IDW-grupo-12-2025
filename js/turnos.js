const medicos = JSON.parse(localStorage.getItem("medicos")) || []
let turnos = JSON.parse(localStorage.getItem("turnos")) || []

const selectMedico = document.getElementById("medico")
const formTurno = document.getElementById("form-turno")
const tablaTurnos = document.getElementById("tabla-turnos")


function cargarMedicos() {
    if (medicos.length === 0) {
            const option = document.createElement("option")
            option.textContent = "No hay médicos disponibles"
            option.disabled = true
            selectMedico.appendChild(option)
            return
        }

    medicos.forEach(medico => {
        const option = document.createElement("option")
        option.value = medico.id;
        option.textContent = `${medico.nombre}`
        selectMedico.appendChild(option)
    })
}


function mostrarTurnos() {
    tablaTurnos.innerHTML = ""
    turnos.forEach((turno, index) => {
        const medico = medicos.find(m => m.id === turno.medicoId)
        const fila = document.createElement("tr")

        fila.innerHTML = `
            <td>${medico ? medico.nombre : " Médico no encontrado "}</td>
            <td>${turno.fechaHora}</td>
            <td>${turno.disponible ? "Sí" : "No"}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="eliminarTurno(${index})">Eliminar</button>
                <button class="btn btn-primary btn-sm" onclick="editarTurno(${index})">Editar</button>
            </td>`

        tablaTurnos.appendChild(fila)
    })
}


function eliminarTurno(index) {
    turnos.splice(index, 1)
    localStorage.setItem("turnos", JSON.stringify(turnos))
    mostrarTurnos()
}

function editarTurno(index) {
  const turno = turnos[index]

  document.getElementById("medico").value = turno.medicoId
  document.getElementById("fechaHora").value = turno.fechaHora
  document.getElementById("disponible").checked = turno.disponible

  indiceEditando = index
  formTurno.querySelector("button[type='submit']").textContent = "Guardar cambios"
}

function guardarCambiosTurno() {
    const medicoId = parseInt(document.getElementById("medico").value)
    const fechaHora = document.getElementById("fechaHora").value
    const disponible = document.getElementById("disponible").checked

    const datosActualizados = {
        medicoId,
        fechaHora,
        disponible
    }

    turnos[indiceEditando] = {
        ...turnos[indiceEditando],
        ...datosActualizados
    }

    localStorage.setItem("turnos", JSON.stringify(turnos))
    formTurno.reset()
    mostrarTurnos()

    indiceEditando = null
    formTurno.querySelector("button[type='submit']").textContent = "Registrar Turno"
}


formTurno.addEventListener("submit", e => {
    e.preventDefault()

    if (indiceEditando !== null) {
        guardarCambiosTurno()
        return
    }


    const nuevoTurno = {
        id: Date.now(),
        medicoId: parseInt(selectMedico.value),
        fechaHora: document.getElementById("fechaHora").value,
        disponible: document.getElementById("disponible").checked
    }

    const turnoDuplicado = turnos.some(t =>
        t.medicoId === nuevoTurno.medicoId && t.fechaHora === nuevoTurno.fechaHora
        )

        if (turnoDuplicado) {
        alert("Este turno ya está registrado para ese médico en ese horario")
        return
    }


    turnos.push(nuevoTurno)
    localStorage.setItem("turnos", JSON.stringify(turnos))
    formTurno.reset()
    mostrarTurnos()
})

document.addEventListener("DOMContentLoaded", () => {
    cargarMedicos()
    mostrarTurnos()
})