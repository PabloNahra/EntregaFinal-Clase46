import { Router } from "express";
import { userModel } from "../models/user.model.js";

const sessionRoutes = Router()

sessionRoutes.post('/register', async (req, res) => {
    const {first_name, last_name, email, age, password} = req.body
    console.log("Entre a registrar")
    try {
        const user = await userModel.create({
            first_name, last_name, email, age, password
        })
        console.log(user)
        req.session.user = user
        res.redirect('/products')
    } catch (error) {
        console.error(error)
        res.status(400).send({error})
    }
})

sessionRoutes.post('/login', async(req, res) => {
    const {email, password} = req.body
    
    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).json({message: "Usuario NO encontrado"})
        }
        if(user.password != password){
            return res.status(401).send({message: "Credenciales invalidas"})
        }
        if(email == "admincoder@coder.com" && password == "adminCod3r123"){
            console.log("Es ADMIN")
            const rol = "admin"
        } else {
            console.log("Es Usuario")
            const rol = "usuario"
        }
        req.session.user = user
        res.redirect('/products')
    } catch (error) {
        res.status(400).send({error})
    }
})

sessionRoutes.post('/logout', async (req, res) => {
    try {
        req.session.destroy((err) => {
            if(err){
                return res.status(500).json ({message: "Fallo al realizar Logout"})
            }            
        })
        res.send({redirect: 'http://localhost:8080/login'})
    } catch (error) {
        res.status(400).send({error})
    }
})

export default sessionRoutes