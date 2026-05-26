const grilla = document.querySelectorAll(".mes");
const btnSubmit = document.querySelector(".btn-submit");

//----------------------------------------------Funciones base para los eventos que vienen despues:

const anioActual = new Date().getFullYear();


function diaDeLaSemana(dia, mes, anio) {
// mes en Date va de 0 a 11
    const fecha = new Date(anio, mes - 1, dia);
    const diaSemana = fecha.getDay(); // 0–6 (domingo–sábado)
    const diaEscrito = ["Dom","Lun","Mar","Mie","Jue","Vie","Sab"];
// Convertir a 1–7 (lunes=1, domingo=7)
    return diaEscrito[diaSemana];
}

//----------------------------------------------Eventos de fetch y demas:

addEventListener("load",async (e)=>{
    const res = await fetch("/api/leercronograma");
    const resCompleta = await res.json();
    const cronogramaRecibido = resCompleta.cronograma;
    const comidasRecibido = resCompleta.comidas;

    let pattern = "";
    for(comida of comidasRecibido){
        pattern += `${comida.tag}|`
    };

    let optionDatalist= "";
    for(comida of comidasRecibido){
        optionDatalist +=`<option value="${comida.tag}"></option>`
    };

    for(objeto of cronogramaRecibido){
        const mesDeObjeto = Math.trunc(objeto.dia / 100);
        const diaDeObjeto = objeto.dia - (mesDeObjeto * 100);
        
        grilla[mesDeObjeto-1].innerHTML += 
            `<p>${diaDeObjeto} (${diaDeLaSemana(diaDeObjeto,mesDeObjeto,anioActual)})</p>
            <input list="d${objeto.dia}" name="d${objeto.dia}" id="${objeto.dia}" value= "${objeto.comida}" pattern="${pattern}">
            <datalist id="d${objeto.dia}">
            ${optionDatalist}
            </datalist>`
    };
})

document.getElementById("grilla-form").addEventListener("submit",async (e)=>{
    e.preventDefault();

    const enero = e.target.children.enero.children;
    const febrero = e.target.children.febrero.children;
    const marzo = e.target.children.marzo.children;
    const abril = e.target.children.abril.children;
    const mayo = e.target.children.mayo.children;
    const junio = e.target.children.junio.children;
    const julio = e.target.children.julio.children;
    const agosto = e.target.children.agosto.children;
    const septiembre = e.target.children.septiembre.children;
    const octubre = e.target.children.octubre.children;
    const noviembre = e.target.children.noviembre.children;
    const diciembre = e.target.children.diciembre.children;

    const elementosFiltrados = [
        ...Array.from(enero).filter(el => el instanceof HTMLInputElement),
        ...Array.from(febrero).filter(el => el instanceof HTMLInputElement),
        ...Array.from(marzo).filter(el => el instanceof HTMLInputElement),
        ...Array.from(abril).filter(el => el instanceof HTMLInputElement),
        ...Array.from(mayo).filter(el => el instanceof HTMLInputElement),
        ...Array.from(junio).filter(el => el instanceof HTMLInputElement),
        ...Array.from(julio).filter(el => el instanceof HTMLInputElement),
        ...Array.from(agosto).filter(el => el instanceof HTMLInputElement),
        ...Array.from(septiembre).filter(el => el instanceof HTMLInputElement),
        ...Array.from(octubre).filter(el => el instanceof HTMLInputElement),
        ...Array.from(noviembre).filter(el => el instanceof HTMLInputElement),
        ...Array.from(diciembre).filter(el => el instanceof HTMLInputElement)
    ];

    const cuerpo = [];
    for(elemento of elementosFiltrados){
        cuerpo.push({"dia" : elemento.id, "comida" : elemento.value})
    };
    console.log(cuerpo);

    try{
        console.log("Hasta aca llego sin problemas.")
    const res = await fetch("/api/escribircronograma",{
        method: "POST",
        headers:{"Content-Type" : "application/json"},
        body: JSON.stringify(cuerpo)
    })
    } catch (err){console.error("ERROR REAL", err)}

    btnSubmit.classList.add("guardado");
})
btnSubmit.addEventListener("animationend",()=>{
    btnSubmit.classList.remove("guardado");
})

const botonesVolver = document.querySelectorAll(".btn-volver");
botonesVolver.forEach((boton,index)=> 
    boton.addEventListener("click",()=>{
    window.location.href = "/admin";
})
)