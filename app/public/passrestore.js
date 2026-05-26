const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("restore-form").addEventListener("submit",async(e)=>{
    e.preventDefault();
    console.log(e)
    const userAndMail = e.target.querySelector("#userAndMail").value;
    const pin = e.target.querySelector("#pin").value;

    if(pin){
        const res = await fetch ("/api/passrestore",{
            method: "POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                pinvalidar: pin,
                userandmail: userAndMail,
                step: "validacion"
            })
        });
        if(!res.ok) {
            mensajeError.classList.toggle("escondido", false);
            const resJson = await res.json();
            mensajeError.innerHTML = resJson.message;
        }
        if(res.ok){
            const formContainer = document.querySelector(".form-container");
            const resJson = await res.json();
            formContainer.innerHTML = `
            <h1 class="validar">Contraseña blanqueada</h1>
            <p class="legend-tip validar">Ahora podrá usar la siguiente clave provisoria para acceder al sistema: </p>
            <p class="reveal">${resJson.message}</p>
            button class="btn-volver" type="button">Volver</button>
            `;
        }
    }
    else{
        const res = await fetch ("/api/passrestore",{
            method: "POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                userandmail: userAndMail,
                step: "solicitud"
            })
        });
        if(!res.ok) {
            mensajeError.classList.toggle("escondido", false);
            const resJson = await res.json();
            mensajeError.innerHTML = resJson.message;
        }
        if(res.ok) {
            const elementosSolicitar = document.querySelectorAll(".solicitar");
            const elementosValidar = document.querySelectorAll(".validar");
            console.log(elementosValidar);
            for(elemento of elementosSolicitar){
                elemento.classList.toggle("escondido", true);
            }
            for(elemento of elementosValidar){
                elemento.classList.toggle("escondido", false);
            }
    }
    }
    
})



const botonesVolver = document.querySelectorAll(".btn-volver");
botonesVolver.forEach((boton,index)=> 
    boton.addEventListener("click",()=>{
    window.location.href = "/admin";
})
)