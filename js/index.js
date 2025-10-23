const MEDICOS_INICIALES = [{
        nombre: "Dr. Juanete Pereyra",
        especialidad: "Cardiología",
        telefono: "123456789",
        email: "juanetepereyra@centromedico.com",
        obraSocial: "OSDE",
        id: 1
    },
    {
        nombre: "Dra. María López",
        especialidad: "Pediatría",
        telefono: "987654321",
        email: "marialopez@centromedico.com",
        obraSocial: "Swiss Medical",
        id: 2
    },
    {
        nombre: "Dr. Carlos Sánchez",
        especialidad: "Dermatología",
        telefono: "456123789",
        email: "carlossanchez@centromedico.com",
        obraSocial: "Galeno",
        id: 3
    }
];

function inicializarLocalStorage() {

    if (!localStorage.getItem("medicos")) {
        localStorage.setItem("medicos", JSON.stringify(MEDICOS_INICIALES));
        console.log("LocalStorage inicializado", MEDICOS_INICIALES);
    } else {
        console.log("LocalStorage ya estaba inicializado");
        console.log("LocalStorage inicializado", MEDICOS_INICIALES);
    }
}

inicializarLocalStorage();