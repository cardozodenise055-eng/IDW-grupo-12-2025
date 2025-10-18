const formlogin = document.getElementById("formlogin");
const usuario = document.getElementById("usuario");
const clave = document.getElementById("clave");
const mensaje = document.getElementById("mensaje");

function mostrarmensaje(texto, tipo = "danger"){
    mensaje.innerHTML = `
           <div class="col-md-6 col-lg-4">
               <div class="alert alert-${tipo}">${texto}</div>
            </div>`;
}

formlogin.addEventListener('submit', function(event){
    event.preventDefault();

    let usuarioinput = usuario.value.trim();
    let clave = clave.value.trim();
})