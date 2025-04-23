import bcryptjs from 'bcryptjs';
import jsonWebToken from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const usuarios = [{
    user: "SrChupapanza",
    email: "damiolivera@gmail.com",
    password: "$2b$05$/CmDOLINFa1fkxigOGGXxuzRgJv3cOFGdAWK9U7MXd0NyBHN6BRgu"
}]

async function login(req,res){
    console.log(req.body)
    const user = req.body.user;
    const password = req.body.password;
    if(!user || !password){
        return res.status(400).send({status:"Error",message:"Los campos estan incorrectos"})
    }
    const userRevise = usuarios.find(usuario => usuario.user === user );
    if(!userRevise){
        return res.status(400).send({status:"Error",message:"Error para logear"})
    }
    const loginCorrecto = await bcryptjs.compare(password,userRevise.password);
    if(!loginCorrecto){
        return res.status(400).send({status:"Error",message:"Error para logear"})
    }
    const token = jsonWebToken.sign({user:userRevise.user},
        process.env.JWT_SECRET, 
        {expiresIn:process.env.JWT_EXPIRATION})
    
        const cookieOption = {
            expires: new Date (Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            path: "/"
    }
   res.cookie("jwt",token,cookieOption);
   res.send({status:"ok", message:"Usuario Loggeado", redirect:"/home"})
}

async function register(req,res){
    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;
    if(!user || !password || !email){
        return res.status(400).send({status:"Error",message:"Los campos estan incorrectos"})
    }
    const userRevise = usuarios.find(usuario => usuario.user === user );
    if(userRevise){
        return res.status(400).send({status:"Error",message:"Este Usuario ya existe"})
    }
    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password,salt);
    const nuevoUsuario ={
        user, email, password: hashPassword
    }
    console.log(nuevoUsuario);
    usuarios.push(nuevoUsuario);
    return res.status(201).send({status:"Ok", message: `Usuario ${nuevoUsuario.user} Creado`,redirect:"/"});
}

export const methods = {
    login,
    register
}