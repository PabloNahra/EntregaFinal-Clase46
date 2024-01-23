import { Router } from "express";
import productsRoutes from "./products.routes.js"
import ProdManager from "../dao/ProductManagerMongo.js";
import { checkAuth, checkExistingUser } from "../middlewares/auth.js";


const viewsRoutes = Router()

const prodManager = new ProdManager()

viewsRoutes.get('/', checkAuth,(req, res) => {
  const { user } = req.session
  res.render('index', user)
})

viewsRoutes.get('/login', checkExistingUser, (req, res) => {
  res.render('login')
})

viewsRoutes.get('/register', checkExistingUser,(req, res) => {
  res.render('register')
})

viewsRoutes.get('/chats', (req, res) => {
  res.render('chats')
})

viewsRoutes.get('/products', async (req, res) => {
  const { page } = req.query
  const products = await prodManager.getProducts(10, page)
  res.render('products', products)
})

export default viewsRoutes