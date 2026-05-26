import { methods as userDB } from "./json.controller.js";

//Devuelve un array con un objeto dentro con los dias laborales de lunes a viernes de todo el año en curso

/* MODO TESTING
const diaActual = 5;
const anioActual = 2026;
const mesActual = 1;
*/

async function escribirCronograma(req,res){
    const anioActual = new Date().getFullYear();
    const mesActual = new Date().getMonth()+1;
    const diaActual = new Date().getDate();
    const updateCronograma = req.body;
    console.log(updateCronograma);


    function esBisiesto(anio) {
        return (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);
    };

    const CantDiasPorMes = [0,31, esBisiesto(anioActual) ? 29 : 28,31,30,31,30,31,31,30,31,30,31];

    const diasTotalesMes = CantDiasPorMes[mesActual];

    //metodo que devuelve dia de la semana 1=lunes - 7=domingo

    function diaDeLaSemana(dia, mes, anio) {
    // mes en Date va de 0 a 11
        const fecha = new Date(anio, mes - 1, dia);
        const diaSemana = fecha.getDay(); // 0–6 (domingo–sábado)
    // Convertir a 1–7 (lunes=1, domingo=7)
        return diaSemana === 0 ? 7 : diaSemana;
    }

    const carga = [];
    
    //CARGAR TODO EN BLANCO
    /*for (let mes = 1; mes < 13; mes++){
        for(let dia = 1; dia <= CantDiasPorMes[mes]; dia++){
            if(diaDeLaSemana(dia,mes,anioActual)<=5){
                let fechaAAgregar = mes*100+dia;
                carga.push({"dia" : fechaAAgregar, "comida" : "sin-carga"});
            }
        }
    };
    */

    const obtenerComidas = async () => {
        const comidas = await userDB.getComidas();
        return comidas
    }
    const comidasExistentes = await obtenerComidas();

    for(let mes = 1; mes < 13; mes++){
        for(let dia = 1; dia <= CantDiasPorMes[mes]; dia++){
            if(diaDeLaSemana(dia,mes,anioActual)<=5){
                let fechaAAgregar = mes*100+dia;
                const coincidenciaCargra = updateCronograma.find(update => update.dia == fechaAAgregar);
                console.log("variable coincidenciaCarga: ", coincidenciaCargra);
                if(!coincidenciaCargra){
                    console.log("Intentaron actualizar el cronograma con datos incorrectos para el dia: ", fechaAAgregar);
                    return res.status(400).send({status:"error",message:"Intentaron actualizar el cronograma con datos incorrectos."});
                }
                const comidaOK = comidasExistentes.find(objeto => objeto.tag == coincidenciaCargra.comida);
                if(comidaOK){
                    carga.push({"dia" : fechaAAgregar, "comida" : coincidenciaCargra.comida});
                }
                else{
                    console.log(`La comida "${coincidenciaCargra.comida}" del dia ${fechaAAgregar} no existe y se agregó "sin-carga"`);
                    carga.push({"dia" : fechaAAgregar, "comida" : "sin-carga"});
                }
                
            };
        };
    };
    console.log(carga);
    await userDB.saveCronograma(carga);
    res.send({status:"ok",message:"cronograma editado",})
};

async function leerCronograma(req,res) {

    const obtenerCronograma = async () => {
        const cro = await userDB.getCronograma();
        const com = await userDB.getComidas();
        return {"cronograma" : cro, "comidas" : com};
    }
    const cronograma = await obtenerCronograma();

    res.send(cronograma);
};

export const methods = {
    leerCronograma,
    escribirCronograma
}