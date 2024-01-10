import { Router } from "express";

const viewsRoutes = Router()

viewsRoutes.get('/', (req, res) => {
    res.render('index')
})

viewsRoutes.get('/chats', (req, res) => {
    res.render('chats')
})

export default viewsRoutes