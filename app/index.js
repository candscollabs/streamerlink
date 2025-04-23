import  express  from "express";
//Fix
import path from 'path';
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { methods as authentication } from "./controllers/authentication.controller.js";

//Server
const app = express();
app.set("port",4000);
app.listen(app.get("port"));
console.log("Servidor Corriendo en puerto", app.get("port"));

//Configuracion
app.use(express.static(__dirname + "/public"));
app.use(express.json());


//Rutas
app.get("/",(req,res)=> res.sendFile(__dirname + "/pages/login.html"));
app.get("/register",(req,res)=> res.sendFile(__dirname + "/pages/register.html"));
app.get("/home",(req,res)=> res.sendFile(__dirname + "/pages/home/home.html"));
app.post("/api/login",authentication.login);
app.post("/api/register",authentication.register);
