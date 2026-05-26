const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("login-form").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const user = e.target.children.user.value;
    const password = e.target.children.password.value;
    const res = await fetch("http://192.168.20.70:4000/api/login",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user,password
        })
    });
    const resJson = await res.json();
    if(!res.ok) {
        mensajeError.classList.toggle("escondido",false);
        mensajeError.innerHTML = resJson.message;
    }
    if(resJson.redirect){
        window.location.href = resJson.redirect;
    }
    
})