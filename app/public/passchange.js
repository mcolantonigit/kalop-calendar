const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("change-form").addEventListener("submit",async(e)=>{
    e.preventDefault();
    const currentPass = e.target.querySelector("#current-password").value;
    const newPass = e.target.querySelector("#new-password").value;
    const newPass2 = e.target.querySelector("#new-password2").value;
    
    if(newPass!==newPass2){
        alert("Los campos de nueva contraseña coinciden.");
        return;
    }
    const res = await fetch ("/api/passchange",{
        method: "POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            newpassword: newPass,
            currentpassword: currentPass
        })
    });
    if(!res.ok) {
        mensajeError.classList.toggle("escondido", false);
        const resJson = await res.json();
        mensajeError.innerHTML = resJson.message;
    }
    if(res.ok) {
        const formContainer = document.querySelector(".form-container");
        document.cookie ='jwt=; Path=/; Expires= Thu, 01 Jan 1970 00:00:02 GMT';
        formContainer.innerHTML = `
        <h1>Contraseña cambiada</h1>
        <p>Por favor, vuelva a iniciar sesión.</p>
        `;
        setTimeout(()=>{
            window.location.href = "/admin";
        },3000);
    }
})

const botonesVolver = document.querySelectorAll(".btn-volver");
botonesVolver.forEach((boton,index)=> 
    boton.addEventListener("click",()=>{
    window.location.href = "/admin";
})
)