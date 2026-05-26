import { methods as userDB } from "./json.controller.js";
import multer from "multer";

const storage = multer.diskStorage({ //modo avanzado de multer
    destination: (req, file, cb) => { //definiendo destination, se personaliza la ruta de guardado de cada archivo
        cb(null, "app/public/images/");
    },
    filename: (req, file, cb) => { //definiendo filename, se personaliza el nombre de archivo de la carga
        cb(null, `${file.fieldname}.png`);
    }
});

const upload = multer({ storage });

async function leerComidas(req,res) {
    const obtenerComidas = async () => {
        const comidas = await userDB.getComidas();
        return comidas
    }
    const comidas = await obtenerComidas();

    res.send(comidas);
};

async function escribirComidas(req,res){
    const updateComidas = JSON.parse(req.body.data);
    await userDB.saveComidas(updateComidas);

    //Obtener cronograma
    const obtenerCronograma = async () => {
        const cronograma = await userDB.getCronograma();
        return cronograma;
    }
    const cronogramaActual = await obtenerCronograma();

    //Reescribir cronograma con las comidas tal cual estan ahora
    const carga = [];

    for(const diaAnalizado of cronogramaActual){
        const comidaOK = updateComidas.find(comida => comida.tag == diaAnalizado.comida);
        if(!comidaOK){
            carga.push({"dia" : diaAnalizado.dia, "comida" : "sin-carga"});
            console.log(`El update de comida ${diaAnalizado.comida} hizo que el dia ${diaAnalizado.dia} ahora quede como "sin-carga".`);
        }
        else{
            carga.push({"dia" : diaAnalizado.dia, "comida" : diaAnalizado.comida});
        }
    }
    await userDB.saveCronograma(carga);
    res.send({status:"ok",message:"comidas editadas",})
}

export const methods = {
    leerComidas,
    escribirComidas,
    upload
}