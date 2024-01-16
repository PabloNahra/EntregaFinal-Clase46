import { Router } from "express";
import productsRoutes from "./products.routes.js"
import ProdManager from "../dao/ProductManagerMongo.js";


const viewsRoutes = Router()

const prodManager = new ProdManager()

viewsRoutes.get('/', (req, res) => {
    res.render('index')
})

viewsRoutes.get('/chats', (req, res) => {
    res.render('chats')
})

/*
Funciona si no paso por products.routes.js
viewsRoutes.get('/products', async (req, res) => {
    console.log('2 - entre al get de productsRoutes')
    const {page } = req.query
    
    try {
      const products = await productsModel.paginate({}, {limit: 2, page: page})
      console.log("2 -products")
      console.log("2 - Renderizo")
      console.log(products)
      res.render('products', {products})
    } catch (error) {
      console.error(error)
      res.status(400).json({message: `No podemos devolver los productos - ${error}`})
    }
})
*/


viewsRoutes.get('/products', async (req, res) => {
  const { page } = req.query
  const products = await prodManager.getProducts(10, page)
  res.render('products', products)
  // res.render('products')
})


export default viewsRoutes