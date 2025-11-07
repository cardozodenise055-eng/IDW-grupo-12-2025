document.addEventListener('DOMContentLoaded', async() =>{
    const tablaUsuariosBody = document.querySelector('#tablaUsuarios tbody')

    try{
        const response = await fetch('https://dummyjson.com/users');
        if(response.ok){
            const data = await response.json();
            const usuarios = data.users;
            
            usuarios.forEach((element) => {
                const fila = document.createElement('tr');
                fila.innerHTML =  `
                    <h5 class="card-title">${element.firstName}</h5>
                    <p class="card-text">${element.username}</p>
                    <p class="card-text">Tel.:${element.email}</p>
                    <p class="card-text">E-mail:${element.phone}</p>
                    </div>
                    </div>
        `;
        tablaUsuariosBody.appendChild(fila);
            });

        }else{
            console.error(response.status);
            throw Error("Error al listar usuarios");
        }
    }catch(error){
        console.error("error", error);
            throw Error("Error en la api Dummy");

    }
})