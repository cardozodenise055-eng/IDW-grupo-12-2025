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
                    <td class="card-title">${element.firstName}</td>
                    <td class="card-text">${element.username}</td>
                    <td class="card-text">Tel.:${element.email}</td>
                    <td class="card-text">E-mail:${element.phone}</td>
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