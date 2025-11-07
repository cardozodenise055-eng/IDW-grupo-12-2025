import { login } from "./auth.js";
const formlogin = document.getElementById("formlogin");
const usuario = document.getElementById("usuario");
const clave = document.getElementById("clave");
const mensaje = document.getElementById("mensaje");

function mostrarmensaje(texto, tipo) {
    mensaje.innerHTML = `
           <div class="col-md-6 col-lg-4">
               <div class="alert alert-${tipo}">${texto}</div>
            </div>`;
}

if (formlogin) {
    formlogin.addEventListener('submit', async function (event) {
        event.preventDefault();

        let usuarioinput = usuario.value.trim();
        let clave_ = clave.value.trim();


        const isusuario = await login(usuarioinput, clave_)

        if (isusuario) {
            sessionStorage.setItem("usuarioLogueado", isusuario.username);
            sessionStorage.setItem("token", isusuario.accessToken);
            mostrarmensaje(`bienvenido usuario ${usuarioinput}`, "success");
            window.location.href = "formulariomedicos.html";
        } else {
            mostrarmensaje('error de credenciales', "danger")
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
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