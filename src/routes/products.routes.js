import { Router } from "express";
import { deleteProduct, getProducts, 
    getProductsById, postProduct, 
    putProduct } from "../controllers/products.controller.js";
import { checkRolAdmin } from "../middlewares/auth.js";

const productsRoutes = Router()

productsRoutes.get('/', getProducts)

productsRoutes.get('/:uId', getProductsById)

productsRoutes.post('/', checkRolAdmin, postProduct)

productsRoutes.delete('/:uId', checkRolAdmin, deleteProduct)

productsRoutes.put('/:uId', checkRolAdmin, putProduct)

export default productsRoutes