const btnSubmit = document.querySelector(".btn-cambios");

addEventListener("load",async(e)=>{
    const res = await fetch("http://192.168.20.70:4000/api/leerfondos");
    resCompleta = await res.json();

    const inputsColores = document.querySelectorAll(".celda-color");
    inputsColores.forEach((input,index)=>
    input.value = resCompleta[index].color);
})

document.addEventListener("change", (e) => {  //EventHandler que detecta cualquier cambio en values dentro del documento
    console.log(e);
    if (!e.target.classList.contains("celda-foto")) return; //analiza si el target del evento tiene una class de nombre "celda-foto"
    const file = e.target.files[0]; //
    if (!file) return;
    if(file.type !== "image/png"){
        alert("Sole se permite subir imagenes en formate PNG.");
        e.target.value = "";
        return;
    }
    const label = document.querySelector(`label[for="${e.target.id}"]`);
    label.style.backgroundImage = `url('${URL.createObjectURL(file)}')`;
});

document.getElementById("fondos-form").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const fondosDOM = document.querySelectorAll(".casilla-fondos");
    const dataColores = [];
    const formData = new FormData();

    const inputsColores = document.querySelectorAll(".celda-color");
    for(input in inputsColores){
        if(input <= 11)
        dataColores.push({"mes": `${Number(input)+1}`, "color" : `${inputsColores[input].value}`})
    }

    console.log(dataColores);

    fondosDOM.forEach((casilla,index)=>{
        const imagen = casilla.querySelector(".celda-foto").files[0];
        let nombre = "";
        const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
        if(imagen){
            if(index > 8){
                nombre = `${index+1}${meses[index]}`}
            else{
                nombre = `0${index+1}${meses[index]}`}
            console.log("imagen detectada en mes: ",nombre)
            formData.append(`${nombre}`, imagen);
        }
    })
    formData.append("data", JSON.stringify(dataColores));
    await fetch("http://192.168.20.70:4000/api/escribirfondos", {
        method: "POST",
        body: formData
    })

    btnSubmit.classList.add("guardado");
})

document.querySelector(".btn-volver").addEventListener("click",()=>{
    window.location.href = "/admin";
})

btnSubmit.addEventListener("animationend",()=>
    btnSubmit.classList.remove("guardado")
)