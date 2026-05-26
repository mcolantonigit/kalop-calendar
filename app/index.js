import express from "express";
import cookieParser from "cookie-parser";

//Fix para __dirname (porque en package.json el "type" esta configurado en "module")
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
//aca termina

import {methods as Authentication} from "./controllers/authentication.controller.js";
import {methods as cronograma} from "./controllers/cronograma.controller.js";
import {methods as comidas} from "./controllers/comidas.controller.js";
import {methods as fondos} from "./controllers/fondos.controller.js";
import {methods as authorization} from "./middlewares/authorization.js";


//Server
const app = express();
app.set("port",4000);
app.listen(app.get("port"), "0.0.0.0");
console.log("Servidor corriendo en puerto",app.get("port"));

//Configuracion
app.use(express.static(__dirname + "/public"))
app.use(express.json());
app.use(cookieParser());

//Rutas
app.get("/", (req,res)=> res.sendFile(__dirname + "/pages/calendario.html"));
app.get("/register", authorization.soloPublico,(req,res)=> res.sendFile(__dirname + "/pages/register.html"));
app.get("/login", authorization.soloPublico,(req,res)=> res.sendFile(__dirname + "/pages/login.html"));
app.get("/admin", authorization.soloAdmin,(req,res)=> res.sendFile(__dirname + "/pages/admin/admin.html"));
app.post("/api/register", Authentication.register);
app.post("/api/login", Authentication.login);
app.get("/calendario",(req,res)=> res.sendFile(__dirname + "/pages/calendario.html"));
app.get("/cronograma", authorization.soloAdmin,(req,res)=> res.sendFile(__dirname + "/pages/admin/cronograma.html"));
app.get("/api/leercronograma", cronograma.leerCronograma);
app.post("/api/escribircronograma", cronograma.escribirCronograma);
app.get("/comidas", authorization.soloAdmin,(req,res)=> res.sendFile(__dirname + "/pages/admin/comidas.html"));
app.get("/api/leercomidas", comidas.leerComidas);
app.post("/api/escribircomidas", comidas.upload.any(), comidas.escribirComidas);
app.get("/fondos", authorization.soloAdmin,(req,res)=> res.sendFile(__dirname + "/pages/admin/fondos.html"));
app.post("/api/escribirfondos", fondos.upload.any(), fondos.escribirFondos);
app.get("/api/leerfondos", fondos.leerFondos);
app.get("/passchange", authorization.soloAdmin,(req,res)=> res.sendFile(__dirname + "/pages/admin/passchange.html"));
app.post("/api/passchange", Authentication.passChange);
app.get("/passrestore", authorization.soloPublico,(req,res)=> res.sendFile(__dirname + "/pages/passrestore.html"));
app.post("/api/passrestore", Authentication.passRestore);