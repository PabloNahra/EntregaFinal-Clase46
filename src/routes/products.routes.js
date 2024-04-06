import { Router } from "express";
import { deleteProduct, getProducts, 
    getProductsById, postProduct, 
    putProduct } from "../controllers/products.controller.js";
import { applyPolicies, checkRolAdmin } from "../middlewares/auth.js";
import { addLogger } from "../utils/logger.js";

const productsRoutes = Router()

productsRoutes.get('/', getProducts)

productsRoutes.get('/:uId', getProductsById)

// productsRoutes.post('/', checkRolAdmin, postProduct)
productsRoutes.post('/', applyPolicies(['ADMIN', 'PREMIUM']), postProduct)

productsRoutes.delete('/:uId', applyPolicies(['ADMIN', 'PREMIUM']), deleteProduct)

productsRoutes.put('/:uId', applyPolicies(['ADMIN', 'PREMIUM']), putProduct)

export default productsRoutes