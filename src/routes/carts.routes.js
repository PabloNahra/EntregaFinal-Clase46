import { Router } from "express";
import { getCarts, getCartsById, 
  postCart,deleteCartById, 
  putCartById, putProductsInCart, 
  deleteProductsInCart, postProductsInCart, confirmCart } from "../controllers/carts.controller.js";
import { applyPolicies, checkRolUser } from "../middlewares/auth.js";

const cartsRoutes = Router()

cartsRoutes.get('/', getCarts)

cartsRoutes.get('/:cId', getCartsById)

// El premium NO puede agregar productos que le pertenecen
cartsRoutes.post('/', postCart)


// Borrar un producto de un carrito puntual
cartsRoutes.delete('/:cId/products/:pId', deleteCartById) 

// Modificar un carrito solo USER Y PREMIUM
//cartsRoutes.put('/:cId', checkRolUser, putCartById)
cartsRoutes.put('/:cId', applyPolicies(['USER', 'PREMIUM']), putCartById)

// Modificar productos del carrito
cartsRoutes.put('/:cId/products/:pId', applyPolicies(['USER', 'PREMIUM']), putProductsInCart)

//cartsRoutes.delete('/:cId', deleteProductsInCart)
cartsRoutes.delete('/:cId', deleteProductsInCart)


cartsRoutes.post("/:cId/product/:pId",  checkRolUser, postProductsInCart)

// Finalizar el proceso de compra
cartsRoutes.post('/:cId/purchase',  confirmCart)


export default cartsRoutes