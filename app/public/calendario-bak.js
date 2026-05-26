const comidasMes = [
    ["Milanesa de carne a la napolitana", "mila-napo"],
    ["Sorrentino de jamos y queso c/ estofado de pollo - 4 quesos - pesto", "sorrentinos"],
    ["Pechugas a la plancha", "pechugas"],
    ["Filet a la romana o matambre de cerdo al verdeo", "filet-cerdo"],
    ["pizza y fainá", "pizzas"],
    ["Feriado", "cerrado"],
    ["Tallarines c/ bolognesa - parisiene - crema - pesto", "tallarines-bolognesa"],
    ["Milanesa de pollo a la fiorentina", "mila-fiorentina"],
    ["Milanesa de pescado o carre de cerdo c/ salsa barbacoa", "filet-cerdo"],
    ["Pan de carne c/ salsa de mostaza", "pan-carne"],
    ["Milanesa de carne c/ ensalada de zanahoria y huevo", "mila-ensalada"],
    ["canelones de verdura c/ salsa fileto y salsa blanca", "canelones-verdura"],
    ["pollo a la provensal al horno", "pollo-horno"],
    ["Filet a la romana o pechito de cerdo", "filet-cerdo"],
    ["Tartas", "tartas"],
    ["Asado banderita y chorizo bombon", "asado-chorizo"],
    ["Ravioles de verdura c/ salsa fileto - crema y albahaca o pesto", "ravioles-fileto"],
    ["empadanas", "empanadas"],
    ["Feriado", "cerrado"],
    ["no laborable", "cerrado"],
    ["Ñoquis tricolor c/ estofado - salsa bechamel - salsa putanesca o pesto", "ñoquis-estofado"],
    ["Bifes anchos c/ salsa criolla y morrones asados", "bifes-criolla"],
    ["Brindis", "brindis"]
];

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
/*
const diaActual = 5;
const anioActual = 2026;
const mesActual = 1;
*/

function esBisiesto(anio) {
    return (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);
}

let diasTotalesMes = 0;
let mesEscrito;

switch(mesActual){
    case 1:
        diasTotalesMes = 31;
        mesEscrito = "ENERO";
        break;
    case 2:
        mesEscrito = "FEBRERO";
        if(esBisiesto(anioActual)){
            diasTotalesMes = 29;
            }
        else{
            diasTotalesMes = 28;
            }
        break;
    case 3:
        diasTotalesMes = 31;
        mesEscrito = "MARZO";
        break;
    case 4:
        diasTotalesMes = 30;
        mesEscrito = "ABRIL";
        break;
    case 5:
        diasTotalesMes = 31;
        mesEscrito = "MAYO";
        break;
    case 6:
        diasTotalesMes = 30;
        mesEscrito = "JUNIO";
        break;
    case 7:
        diasTotalesMes = 31;
        mesEscrito = "JULIO";
        break;
    case 8:
        diasTotalesMes = 31;
        mesEscrito = "AGOSTO";
        break;
    case 9: 
        diasTotalesMes = 30;
        mesEscrito = "SEPTIEMBRE";
        break;
    case 10: 
        diasTotalesMes = 31;
        mesEscrito = "OCTUBRE";
        break;
    case 11: 
        diasTotalesMes = 30;
        mesEscrito = "NOVIEMBRE";
        break;
    case 12: 
        diasTotalesMes = 31;
        mesEscrito = "DICIEMBRE";
        break;
}

//Le paso texto al titulo

titulo.innerHTML = `Menú - ${mesEscrito}`;
//metodo que devuelve dia de la semana 1=lunes - 7=domingo

function diaDeLaSemana(dia, mes, anio) {
// mes en Date va de 0 a 11
    const fecha = new Date(anio, mes - 1, dia);
    const diaSemana = fecha.getDay(); // 0–6 (domingo–sábado)
// Convertir a 1–7 (lunes=1, domingo=7)
    return diaSemana === 0 ? 7 : diaSemana;
}

let diasADibujar = [];
//recorrer un array con el numero total de dias que tiene el mes
for(let i = 1; i <= diasTotalesMes; i++){
//hacer un IF que evalue si el DATE es 5 o menor
    if(diaDeLaSemana(i,mesActual,anioActual)<=5){
//dibuja una celda con el numero de dia
        diasADibujar.push(i);
    }
}

//dibuja celdas en blanco en la tabla de calendario para que coincidan con el rotulo de nombre.
for(let i = diaDeLaSemana(diasADibujar[0],mesActual,anioActual); i>1; i--){
        tablaCalendario.innerHTML += "<div></div>";
    }

console.log(`La longitud de diasADibujar es ${diasADibujar.unshift()-1}`);



//dibujando la tabla del calendario
for(dia in diasADibujar){
    console.log(`Se configuró como dia a dibujar N: ${dia} al día N: ${diasADibujar[dia]} cubriendo la comida: ${comidasMes[dia][0]} con la imagen ${comidasMes[dia][1]}`);
    if(diasADibujar[dia] == diaActual){
            tablaCalendario.innerHTML += `<div class="fondo ${comidasMes[dia][1]}">
                                            <div class="tabla__celda hoy">
                                                <p class="celda__dia">${diasADibujar[dia]}</p>
                                                <p class="celda__comida">${comidasMes[dia][0]}</p>
                                            </div>
                                        </div>
                                        `;

            panelTresdias.innerHTML += `<div class="tresdias-hoy">
                                            <h2>HOY</h2>
                                            <div class="tresdias-foto-hoy ${comidasMes[dia][1]}">
                                                <p>${comidasMes[dia][0]}</p>
                                        </div>
                                        `;
    }
    else{
            tablaCalendario.innerHTML += `<div class="fondo ${comidasMes[dia][1]}">
                                    <div class="tabla__celda">
                                        <p class="celda__dia">${diasADibujar[dia]}</p>
                                        <p class="celda__comida">${comidasMes[dia][0]}</p>
                                    </div>
                                </div>
                                `
    }
    if(diasADibujar[dia] == diaActual-1){ //dibuja AYER
        panelTresdias.innerHTML += `<div class="tresdias-ayer">
                                        <h2>AYER</h2>
                                        <div class="tresdias-foto-ayer ${comidasMes[dia][1]}"></div>
                                    </div>`;
    }
        if(diasADibujar[dia] == diaActual+1){ //dibuja MAÑANA
        panelTresdias.innerHTML += `<div class="tresdias-mañana">
                                        <h2>MAÑANA</h2>
                                        <div class="tresdias-foto-mañana ${comidasMes[dia][1]}"></div>
                                    </div>`;
    }
}

console.log(`dia: ${diaActual}, mes: ${mesActual}, año: ${anioActual}, tiene ${diasTotalesMes}`)

//le pasa imagenes y dibuja el panel del dia "ayer y mañana . Hoy se dibuja con el panel de ariba"