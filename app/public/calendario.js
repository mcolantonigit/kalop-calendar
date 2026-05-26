/*prompt para copilot:

Fotografía gastronómica profesional de un plato de , presentado de forma limpia y equilibrada.
Plato servido en un plato blanco mate, centrado en la imagen.
Estilo minimalista y elegante, pensado para una cartilla de menú.
Iluminación suave y difusa, simulando luz natural de estudio, sin sombras duras.
Fondo liso y neutro (gris claro o beige suave), desenfocado.
Ángulo de cámara 3/4 ligeramente elevado, típico de fotografía de menú.
Profundidad de campo media, enfoque nítido en el plato.
Colores naturales, sin saturación excesiva.
Sin manos, sin personas, sin texto, sin logos, sin elementos decorativos innecesarios.
Estética consistente, como parte de una misma sesión fotográfica de restaurante.
Resolución 600x400, relación de aspecto horizontal.
*/


const tablaCalendario = document.querySelector(".calendario__tabla");
const titulo = document.querySelector(".titulo");
const fotoHoy = document.querySelector(".foto-hoy");
const panelTresdias = document.querySelector(".panel-tresdias");

const anioActual = new Date().getFullYear();
const mesActual = new Date().getMonth()+1;
const diaActual = new Date().getDate();

function diaDeLaSemana(dia, mes, anio) {
// mes en Date va de 0 a 11
    const fecha = new Date(anio, mes - 1, dia);
    const diaSemana = fecha.getDay(); // 0–6 (domingo–sábado)
// Convertir a 1–7 (lunes=1, domingo=7)
    return diaSemana === 0 ? 7 : diaSemana;
}

let mesEsc = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];
let mesEscrito = mesEsc[mesActual-1];

//Le paso texto al titulo

titulo.innerHTML = `Menú - ${mesEscrito}`;

addEventListener("load", async(e)=>{
    const res = await fetch("/api/leercronograma");
    const resCompleta = await res.json();
    const coloresActual = await fetch("/api/leerfondos");
    const coloresJson = await coloresActual.json();
    const colorInterfaz = coloresJson.find(color=> color.mes == mesActual);
    document.body.style.setProperty("--color-uno", `${colorInterfaz.color}`);

    const comidasRecibido = Array.from(resCompleta.comidas);
    const cronogramaRecibido = Array.from(resCompleta.cronograma);
    const cronogramaMes = [];
    const limiteMinMes = mesActual*100;
    const limiteMaxMes = limiteMinMes+100;

    const fondoSegunMes = ["01enero","02febrero","03marzo","04abril","05mayo","06junio","07julio","08agosto","09septiembre","10octubre","11noviembre","12diciembre"];
    const body = document.body;
    body.style.backgroundImage = `url(images/${fondoSegunMes[mesActual-1]}.png)`;

    for(objeto of cronogramaRecibido){
        if(objeto.dia > limiteMinMes && objeto.dia <limiteMaxMes){
            const comidaBuscada = comidasRecibido.find(comida => comida.tag === objeto.comida);
            cronogramaMes.push({"dia" : objeto.dia, "comida" : objeto.comida, "detalle" : comidaBuscada.nombre})
        }
    }

    //dibuja celdas en blanco en la tabla de calendario para que coincidan con el rotulo de nombre.
    for(let i = 1 ; i < diaDeLaSemana(cronogramaMes[0].dia - (mesActual*100),mesActual,anioActual); i++){
        tablaCalendario.innerHTML += `<div class="blank"></div>`;
    }

    //dibujando la tabla del calendario
    for(objeto of cronogramaMes){
        if(objeto.dia-mesActual*100 == diaActual){
            tablaCalendario.innerHTML += 
                `<div class="fondo" style="background-image: url('images/${objeto.comida}.png');">
                <div class="tabla__celda hoy">
                <p class="celda__dia">${objeto.dia-mesActual*100}</p>
                <p class="celda__comida">${objeto.detalle}</p>
                </div>
                </div>`;
            panelTresdias.innerHTML += 
                `<div class="tresdias-hoy">
                <h2>HOY</h2>
                <div class="tresdias-foto-hoy" style="background-image: url('images/${objeto.comida}.png');">
                <p>${objeto.detalle}</p>
                </div>`;
        }
        else{
            tablaCalendario.innerHTML += 
            `<div class="fondo" style="background-image: url('images/${objeto.comida}.png');">
            <div class="tabla__celda">
            <p class="celda__dia">${objeto.dia-mesActual*100}</p>
            <p class="celda__comida">${objeto.detalle}</p>
            </div>
            </div>`
        }
        if(objeto.dia-mesActual*100  == diaActual-1 && objeto.comida !== "sin-carga"){ //dibuja AYER
        panelTresdias.innerHTML +=
        `<div class="tresdias-ayer">
        <h2>AYER</h2>
        <div class="tresdias-foto-ayer" style="background-image: url('images/${objeto.comida}.png');">
        </div>
        </div>`
        }
        if(objeto.dia-mesActual*100  == diaActual+1 && objeto.comida !== "sin-carga"){ //dibuja MAÑANA
        panelTresdias.innerHTML += 
        `<div class="tresdias-mañana">
        <h2>MAÑANA</h2>
        <div class="tresdias-foto-mañana" style="background-image: url('images/${objeto.comida}.png');">
        </div>
        </div>`
        }
    }
})

const animationStart = document.querySelector(".silueta");
animationStart.addEventListener("animationend",()=>{
    const telon = document.querySelector(".telon");
    telon.classList.add("escondido");
    telon.innerHTML = "";
    
})