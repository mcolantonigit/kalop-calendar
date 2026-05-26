import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { methods as userDB } from "../controllers/json.controller.js";

dotenv.config();

async function soloAdmin(req,res,next){
    const logueado = await revisarCookie(req);
    if(logueado) return next();
    return res.redirect("/login")
};

async function soloPublico(req,res,next){
    const logueado = await revisarCookie(req);
    if(!logueado) {
        console.log("se lo envia a next")
        return next();
    }
    return res.redirect("/admin")
};

async function revisarCookie(req){
    if(!req.headers.cookie){
        console.log("usuario sin cookie de login.")
        return false;
    }
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    console.log("Cookie", cookieJWT);
    const decodificada = jsonwebtoken.verify(cookieJWT,process.env.JWT_SECRET);
    console.log("Cookie decodificada:", decodificada);

    const obtenerUsuarios = async () => {
            const usuarios = await userDB.getUsuarios();
            return usuarios;
        }
    const listaUsuarios = await obtenerUsuarios();

    const usuarioARevisar = listaUsuarios.find(usuario => usuario.user === decodificada.user);

    if(!usuarioARevisar){
        return false;
    }
    return true;
}

export const methods = {
    soloAdmin,
    soloPublico
}