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

/*
viewsRoutes.get('/products', async (req, res) => {
  const { page } = req.query
  const { user } = req.session
  console.log(user)
  const products = await prodManager.getProducts(10, page)
  res.render('products', products)
})
*/

viewsRoutes.get('/products', async (req, res) => {
  try {
    const { page } = req.query;
    const { user } = req.session
    const products = await prodManager.getProducts(10, page);

    res.render('products', { user, products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

viewsRoutes.get('/failregister', (req, res) => {
  res.render('failregister')
})

viewsRoutes.get('/faillogin', (req, res) => {
  res.render('faillogin')
  //res.status(401).send({message: 'Usuario No autorizado'})
})




export default viewsRoutes