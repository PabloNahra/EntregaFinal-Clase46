import { Router } from "express";
import productsRoutes from "./products.routes.js"


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
    //res.render('products', {products: [{title: "hola"}]})
    //const productos = {products: [{title: "hola"}]}
    //console.log(productos)
    //res.render('products', {products: productos})
    try {
      console.log("Entre al try")
      // Utiliza directamente el método get de productsRoutes
      const {category, page } = req.query;
      console.log(category)
      console.log(page)
      // const { products } = productsRoutes.get({category, page});
      let { products } = productsRoutes.get({});
      console.log("products")
      console.log(products)
      // Renderiza la vista 'products' con el objeto products como contexto
      res.render('products', { products });
    } catch (error) {
      // Manejar errores aquí
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
})


export default viewsRoutes