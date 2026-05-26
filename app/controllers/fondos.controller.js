import multer from "multer";
import { methods as userDB } from "./json.controller.js";

const storage = multer.diskStorage({ //modo avanzado de multer
    destination: (req, file, cb) => { //definiendo destination, se personaliza la ruta de guardado de cada archivo
        cb(null, "app/public/images/");
    },
    filename: (req, file, cb) => { //definiendo filename, se personaliza el nombre de archivo de la carga
        cb(null, `${file.fieldname}.png`);
    }
});
const upload = multer({ storage });

async function escribirFondos(req,res) {
    const updateColores = JSON.parse(req.body.data);

    await userDB.saveColores(updateColores);
    res.send({status:"ok",message:"Fondos editados"})
}

async function leerFondos(req,res) {
    const obtenerColores = async ()=>{
        const colores = await userDB.getColores();
        return colores
    }
    const coloresActuales = await obtenerColores();
    res.send(coloresActuales);
}

export const methods = {
    escribirFondos,
    leerFondos,
    upload
}