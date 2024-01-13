import { Router } from "express";
import { productsModel } from "../models/products.model.js"
import productsRoutes from "./productsFS.routes";

const viewsRoutes = Router()

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
    res.render('products', {products: products.docs})
})

export default viewsRoutes