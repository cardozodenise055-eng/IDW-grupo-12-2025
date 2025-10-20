const formlogin = document.getElementById("formlogin");
const usuario = document.getElementById("usuario");
const clave = document.getElementById("clave");
const mensaje = document.getElementById("mensaje");

function mostrarmensaje(texto, tipo){
    mensaje.innerHTML = `
           <div class="col-md-6 col-lg-4">
               <div class="alert alert-${tipo}">${texto}</div>
            </div>`;
}

formlogin.addEventListener('submit', function(event){
    event.preventDefault();

    let usuarioinput = usuario.value.trim();
    let clave_ = clave.value.trim();

    const isusuario = usuarios.find(
        u => u.usuario === usuarioinput && u.clave === clave_
    );

    if(isusuario){
        sessionStorage.setItem("usuarioLogueado", usuarioinput);
        mostrarmensaje(`bienvenido usuario ${usuarioinput}`,"success");
        window.location.href = "formulariomedicos.html";
    } else{
        mostrarmensaje('error de credenciales', "danger")
    }
})