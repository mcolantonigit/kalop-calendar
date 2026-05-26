const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("register-form").addEventListener("submit",async(e)=>{
    e.preventDefault();
    const res = await fetch ("/api/register",{
        method: "POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            user: e.target.children.user.value,
            mail: e.target.children.mail.value,
            password: e.target.children.password.value,
            adminpass: e.target.children.adminpass.value
        })
    });
    if(!res.ok) {
        mensajeError.classList.toggle("escondido", false);
        const resJson = await res.json();
        mensajeError.innerHTML = resJson.message;
    }
    const resJson = await res.json();
    if(resJson.redirect){
        window.location.href = resJson.redirect;
    }
})
