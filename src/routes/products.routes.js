import { Router } from "express";
import { deleteProduct, getProducts, 
    getProductsById, postProduct, 
    putProduct } from "../controllers/products.controller.js";
// import { productsModel } from "../models/products.model.js"
// import ProdManager from "../dao/ProductManagerMongo.js";
// import { productsServices2 } from "../dao/repositories/index.js";


const productsRoutes = Router()

// Directo al repository
/*
productsRoutes.get('/', async (req, res) => {
    const products = await productsServices2.getProducts2()
    res.send(products)
})
*/
// Directo al controller
productsRoutes.get('/', getProducts)


productsRoutes.get('/:uId', getProductsById)

// Directo al repository
/*
productsRoutes.post('/', (req, res) => {
    const product = req.body
    const result = productsServices2.createProduct2(product)
})
*/
// Directo al controller
productsRoutes.post('/', postProduct)


productsRoutes.delete('/:uId', deleteProduct)

productsRoutes.put('/:uId', putProduct)

export default productsRoutes