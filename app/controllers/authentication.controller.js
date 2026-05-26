import { methods as userDB } from "./json.controller.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const adminPassOk = "m3c4n1c426#"

let blanqueos = [];

async function login(req,res){
        //TOMO VALORES DEL JSON QUE ALMACENA USUARIOS Y LOS PASO A UNA VARIABLE
    const obtenerUsuarios = async () => {
        const usuarios = await userDB.getUsuarios();
        return usuarios;
    }
    const listaUsuarios = await obtenerUsuarios();
    //TOMO VALORES DESDE EL POST QUE VIENE DEL FRONT
    const user = req.body.user;
    const password = req.body.password;
    if(!user || !password){
        return res.status(400).send({status:"error",message:"Los campos no pueden quedar vacios."});
    }

    const usuarioARevisar = listaUsuarios.find(usuario => usuario.user === user);
    if(!usuarioARevisar){
        console.log("Un usuario intentó loggearse con un username inexistente: " + user);
        return res.status(400).send({status:"error",message:"Usuario o contraseña incorrectos."})
    };
    const loginCorrecto = await bcryptjs.compare(password, usuarioARevisar.password);
    if(!loginCorrecto){
        console.log("Un usuario intentó loggearse con una contraseña incorrecta: " + password);
        return res.status(400).send({status:"error",message:"Usuario o contraseña incorrectos."})
    };
    const token = jsonwebtoken.sign(
        {user:usuarioARevisar.user},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRATION});
    
    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 *60 * 1000),
        path: "/"
    }

    res.cookie("jwt",token,cookieOption);
    res.send({status:"ok",message:"usuario loggeado",redirect:"/admin"})
}

async function register(req,res){
    //TOMO VALORES DESDE EL POST QUE VIENE DEL FRONT
    const user = req.body.user;
    const password = req.body.password;
    const mail = req.body.mail;
    const adminpass = req.body.adminpass;
    //TOMO VALORES DEL JSON QUE ALMACENA USUARIOS Y LOS PASO A UNA VARIABLE
    const obtenerUsuarios = async () => {
        const usuarios = await userDB.getUsuarios();
        return usuarios;
    }
    const listaUsuarios = await obtenerUsuarios();

    if(!user || !password || !mail || !adminpass){
        return res.status(400).send({status:"error",message:"Los campos no pueden quedar vacios."});
    }

    const usuarioARevisar = listaUsuarios.find(usuario => usuario.user === user);
    const mailARevisar = listaUsuarios.find(usuario => usuario.mail === mail);   
    if(usuarioARevisar){
        console.log("Un usuario intentó registrarse con un username en uso: " + user);
        return res.status(400).send({status:"error",message:"El nombre de usuario ya se encuentra en uso."})
    };
    
    if(mailARevisar){
        console.log("Un usuario intentó registrarse con un correo en uso: " + mail);
        return res.status(400).send({status:"error",message:"El email ya se encuentra en uso."})
    };
    if(adminpass != adminPassOk){
        console.log("Un usuario intentó registrarse con un Admin-Token incorrecto: " + adminpass)
        return res.status(400).send({status:"error",message:"Admin-Token incorrecto. Comunicate con el sector de sistemas."})
    }

    //proceso de encriptado de contraseña con bcryptjs

    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password,salt);

    const nuevoUsuario = {
        user, mail, password:hashPassword
    }
    
    listaUsuarios.push(nuevoUsuario);

    userDB.saveUsuarios(listaUsuarios);

    res.status(201).send({status:"ok", message:`Usuario ${nuevoUsuario} agregado`, redirect:"/"})

};

async function passChange(req,res) {
    const obtenerUsuarios = async () => {
        const usuarios = await userDB.getUsuarios();
        return usuarios;
    }
    const listaUsuarios = await obtenerUsuarios();

    const newPass = req.body.newpassword;
    const currentPass = req.body.currentpassword;
    if(!newPass || !currentPass){
        return res.status(400).send({status:"error",message:"Los campos no pueden quedar vacios."});
    }

    if(!req.headers.cookie){//---------------------------------ANALISIS DE COOKIE
        return res.status(400).send({status:"error",message:"usuario sin cookie de login."});
    }
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    const decodificada = jsonwebtoken.verify(cookieJWT,process.env.JWT_SECRET);

    const usuarioARevisar = listaUsuarios.find(usuario => usuario.user === decodificada.user);

    if(!usuarioARevisar){
        return res.status(400).send({status:"error",message:"Cookie de login con parametros incorrectos."});
    }
    const loginCorrecto = await bcryptjs.compare(currentPass, usuarioARevisar.password);
    if(!loginCorrecto){
        console.log("Un usuario intentó loggearse con una contraseña incorrecta: " + currentPass);
        return res.status(400).send({status:"error",message:"Contraseña actual incorrecta."})
    };
    //--------------------------------------------------------------------------CAMINO CORRECTO
    res.send({status:"ok",message:"usuario loggeado",redirect:"/admin"})

    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(newPass,salt);

    usuarioARevisar.password = hashPassword;

    userDB.saveUsuarios(listaUsuarios);

    res.status(201).send({status:"ok", message:`Usuario ${usuarioARevisar} agregado`})
}

async function passRestore(req,res) {
    const userAndMail = req.body.userandmail;
    const pin = req.body.pinvalidar;
    const step = req.body.step;

    const obtenerUsuarios = async () => {
        const usuarios = await userDB.getUsuarios();
        return usuarios;
        }
    const listaUsuarios = await obtenerUsuarios();

    if(step == "solicitud"){
        const usuarioARevisar = listaUsuarios.find(usuario => usuario.user === userAndMail || usuario.mail === userAndMail);
        if(!usuarioARevisar){
            console.log("Intentaron hacer una restauración con un dato erroneo: " + userAndMail);
            return res.status(201).send({status:"ok", message:`No encontré ningun usuario LOL.`})
        };
        const generandoPIN = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
        const blanqueoARevisar = blanqueos.find(blanqueo => blanqueo.user === usuarioARevisar.user)
        if (!blanqueoARevisar){
            blanqueos.push({"user" : usuarioARevisar.user, "pin" : generandoPIN});
        }
        else{
            blanqueoARevisar.pin = generandoPIN;
        }
        console.log(`El usuario ${usuarioARevisar.user} con mail ${usuarioARevisar.mail} solicita restauración de clave. PIN: ${generandoPIN}`)
        res.status(201).send({status:"ok", message:`PIN generado.`})
    };
    if(step == "validacion"){
        const usuarioARevisar = listaUsuarios.find(usuario => usuario.user === userAndMail || usuario.mail === userAndMail);
        if(!usuarioARevisar){
            return res.status(400).send({status:"error",message:"Falló el blanqueo de clave. Por favor, intentalo mas tarde."});
        }

        const blanqueoARevisar = blanqueos.find(blanqueo => blanqueo.user === usuarioARevisar.user);

        if(!blanqueoARevisar){
            return res.status(400).send({status:"error",message:"Blanqueo no solicitado."});
        }

        if(pin !== blanqueoARevisar.pin){
            return res.status(400).send({status:"error",message:"PIN de confirmación incorrecto."});
        }

        const passProvisoria = `${usuarioARevisar.user}${blanqueoARevisar.pin}++`;

        const salt = await bcryptjs.genSalt(5);
        const hashPassword = await bcryptjs.hash(passProvisoria,salt);

        usuarioARevisar.password = hashPassword;
        userDB.saveUsuarios(listaUsuarios);
        res.status(201).send({status:"ok", message:`${passProvisoria}`});
    }
}


export const methods = {
    login,
    register,
    passChange,
    passRestore
}