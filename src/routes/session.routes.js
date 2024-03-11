import { Router } from "express";
import { userModel } from "../models/user.model.js";
import { createHash } from "../utils/bcrypt.js";
import passport from "passport";
import { getSession, getSessionEmail } from "../controllers/sessions.controller.js";

const sessionRoutes = Router()

sessionRoutes.post(
    '/register', 
    passport.authenticate('register', {failureRedirect: '/failregister'}), 
    async (req, res) => {
        //res.status(201).send({message: 'Usuario registrado'})
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
        };
        res.redirect('/')
})

sessionRoutes.post(
    '/login', 
    passport.authenticate('login', { failureRedirect: '/faillogin'}),
    async(req, res) => {
        if(!req.user){
            return res.status(401).send({message: 'Error en las credenciales'})
        }
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }
        res.redirect('/')
})

sessionRoutes.post('/logout', async (req, res) => {
    try {
        req.session.destroy((err) => {
            if(err){
                return res.status(500).json ({message: "Fallo al realizar Logout"})
            }            
        })
        res.send({redirect: 'http://localhost:8080/login'})
        // res.redirect('/login')
    } catch (error) {
        res.status(400).send({error})
    }
})

sessionRoutes.post('/recovery', async (req, res) => {
    const {email, password } = req.body
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(400).send({message: 'Error'})
    }
    user.password = createHash(password)
    user.save()
    res.send({message: 'Password changed'})
})

sessionRoutes.get(
    '/github', 
    passport.authenticate('github', {scope:['user:email']}), 
    (req, res) => {

})

sessionRoutes.get(
    '/githubcallback', 
    passport.authenticate('github', {failureRedirect: '/login'}),
    (req, res) => {
        req.session.user = req.user
        res.redirect('/')
    }
)


sessionRoutes.get('/current', getSessionEmail)

export default sessionRoutes