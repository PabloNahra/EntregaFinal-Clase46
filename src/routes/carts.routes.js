import { Router } from "express";
import { getCarts, getCartsById, 
  postCart, deleteCartById, 
  putCartById, putProductsInCart, 
  deleteProductsInCart, deleteProductInCart,
  postProductsInCart, 
  confirmCart, getCartsByUserEmail } from "../controllers/carts.controller.js";
import { applyPolicies, checkRolUser } from "../middlewares/auth.js";

const cartsRoutes = Router()

// Obtener todos los carritos
cartsRoutes.get('/', getCarts) // Doc 

// Obtener un carrito por ID
cartsRoutes.get('/:cId', getCartsById) // Doc

// Obtener los carritos de un usuarios por mail
cartsRoutes.get('/user_email/:uEmail', getCartsByUserEmail)

// El premium NO puede agregar productos que le pertenecen
cartsRoutes.post('/', postCart) // Doc

// Borrar un producto de un carrito puntual (estaba borrando todo el carrito)
/*
cartsRoutes.delete('/:cId/products/:pId', deleteCartById) // Doc
*/
cartsRoutes.delete('/:cId/products/:pId', deleteProductInCart) // Doc


cartsRoutes.delete('/:cId', deleteProductsInCart) // Doc


// Modificar un carrito solo USER Y PREMIUM
cartsRoutes.put('/:cId', applyPolicies(['USER', 'PREMIUM']), putCartById) // Doc

// Modificar productos del carrito
cartsRoutes.put('/:cId/products/:pId', applyPolicies(['USER', 'PREMIUM']), putProductsInCart) // Doc


// Agregamos una cantidad de productos
cartsRoutes.post("/:cId/product/:pId",  applyPolicies(['USER', 'PREMIUM']), postProductsInCart) // Doc

// Finalizar el proceso de compra
cartsRoutes.post('/:cId/purchase',  confirmCart) // Doc


export default cartsRoutes