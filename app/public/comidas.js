const grillaComidas = document.getElementById("comidas-form");
const btnSubmit = document.querySelector(".btn-cambios");
let resCompleta = [];

addEventListener("load", async(e)=>{
    const res = await fetch("/api/leercomidas");
    resCompleta = await res.json();

    for(objeto of resCompleta){
        grillaComidas.innerHTML += `
            <div class="casilla-comida ${objeto.tag}">
            <label for="celda-foto-${objeto.tag}" class="foto-container" style="background-image: url('images/${objeto.tag}.png');">
            <div class="editar-container"><p>Editar foto</p></div>
            </label>
            <input type="file" accept=".png" id="celda-foto-${objeto.tag}" class="celda-foto">
            <label for="celda-tag-${objeto.tag}">Tag: </label>
            <input type="text" class="celda-tag" id="celda-tag-${objeto.tag}" value="${objeto.tag}" readonly>
            <label for="celda-detalle-${objeto.tag}">Detalle: </label>
            <input type="text" class="celda-detalle" id="celda-detalle-${objeto.tag}" value="${objeto.nombre}">
            <button type="button" class="btn-borrar" id="borrar-${objeto.tag}">X</button>
            </div>
        `;

    }
})



document.getElementById("busqueda-form").addEventListener("submit",async (e)=>{
    e.preventDefault();
    const busqueda = e.target.elements["barra-busqueda"].value;

    const res = await fetch("/api/leercomidas");
    const resCompleta = await res.json();

    const filtrado = [
        ...Array.from(resCompleta).filter(el => el.tag.toLowerCase().includes(busqueda.toLowerCase())),
        ...Array.from(resCompleta).filter(el => el.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    ];
    console.log(filtrado);
    const vistos = new Set(); //se genera una estructura "SET" que solo permite valores unicos (quitando duplicados)
    
    const arraySinDup = filtrado.filter(obj => { //generas un array nuevo que va a contener los objetos sin duplicados y filtras el array en crudo
        const clave = `${obj.tag}|${obj.nombre}`; //se genera un tipo de dato que se va a usar para comparar con la estructura set
        
        if (vistos.has(clave)) {
            return false;
        }

        vistos.add(clave);
        return true;
    });

    for(objeto of resCompleta){
        const target = document.getElementsByClassName(objeto.tag);
        const encontrado = arraySinDup.find(obj => obj.tag === objeto.tag);
        console.log("valor de Encontrado: ", encontrado);
        if(!encontrado){
            target[0].classList.toggle("escondido",true);
            console.log(objeto, "Escondido")

        }
        else{
            target[0].classList.toggle("escondido",false);
            console.log(objeto, "mostrado")
        }
    }
    return;
})

let numeracion = 1;

document.getElementsByClassName("btn-agregar")[0].addEventListener("click",(e)=>{
    const nuevoElemento = {"nombre" : `Detalles del nuevo elemento0${numeracion}`, "tag" : `nuevo-elemento0${numeracion}`};
    resCompleta.push(nuevoElemento);
    numeracion++;

    grillaComidas.innerHTML += `
        <div class="casilla-comida ${nuevoElemento.tag} new-element" style="order: -${numeracion};">
        <label for="celda-foto-${nuevoElemento.tag}" class="foto-container" style="background-image: url('images/sin-carga.png');">
        <div class="editar-container"><p>Editar foto</p></div>
        </label>
        <input type="file" accept=".png" id="celda-foto-${nuevoElemento.tag}" class="celda-foto">
        <label for="celda-tag-${nuevoElemento.tag}">Tag </label>
        <input type="text" class="celda-tag" id="celda-tag-${nuevoElemento.tag}" value="${nuevoElemento.tag}">
        <label for="celda-detalle-${nuevoElemento.tag}">Detalle: </label>
        <input type="text" class="celda-detalle" id="celda-detalle-${nuevoElemento.tag}" value="${nuevoElemento.nombre}">
        <button type="button" class="btn-borrar" id="borrar-${nuevoElemento.tag}">X</button>
        </div>
        `;
})

//CUANDO SE CARGA UNA IMAGEN, EL EVENTO QUE SIGUE SE ENCARGA DE HACERLA VISIBLE EN SU LABEL
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

document.addEventListener("click",(e)=>{
    if(!e.target.classList.contains("btn-borrar")) return;
    const objetivoFull = e.target.id;
    const objetivo = objetivoFull.substring(7);
    const casillaComida = document.querySelector(`.${objetivo}`);
    console.log(casillaComida);
    if(casillaComida.classList.contains("borrado-pendiente")){
        casillaComida.classList.toggle("borrado-pendiente",false);
    }
    else{casillaComida.classList.toggle("borrado-pendiente",true);}
})


document.getElementById("comidas-form").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const comidasDOM = document.querySelectorAll(".casilla-comida");
    const formData = new FormData();
    const datosDeCarga = [];
    let hayError = false;

    comidasDOM.forEach((comida,index) =>{
        if(comida.classList.contains("borrado-pendiente")) return;
        const nombre = comida.querySelector(".celda-detalle").value;
        const tag = comida.querySelector(".celda-tag").value;
        const imagen = comida.querySelector(".celda-foto").files[0];

        const safeTag = tag
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "");

        datosDeCarga.push({
            "nombre" : nombre,
            "tag" : safeTag
        });
        
        if(imagen){
            formData.append(`${safeTag}`, imagen);
        };
        if(!imagen && comida.classList.contains("new-element")){
            alert(`Debe cargar una nueva imagen para el nuevo elemento "${safeTag}"`)
            hayError = true;
            return;
        }
    })
    if(hayError) return;
    for(comidas of datosDeCarga){

        const duplicado = datosDeCarga.filter(obj => obj.tag == comidas.tag)
        console.log(duplicado.length);
        if(duplicado.length>1) {
            alert(`El valor Tag ${comidas.tag} ya se encuentra en uso.`);
            return;
        }
    }

    formData.append("data", JSON.stringify(datosDeCarga));

    console.log(datosDeCarga);

    await fetch("/api/escribircomidas", {
        method: "POST",
        body: formData
    })
    btnSubmit.classList.add("guardado");
})

btnSubmit.addEventListener("animationend", () =>{
    btnSubmit.classList.remove("guardado");
    window.location.reload();
})

document.querySelector(".btn-volver").addEventListener("click",()=>{
    window.location.href = "/admin";
})