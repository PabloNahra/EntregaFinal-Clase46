import { Router } from "express";
import { cartsModel } from "../models/carts.model.js"
import CartManager from "../dao/mongo/CarritoManagerMongo.js";
import { getCarts, getCartsById, 
  postCart,deleteCartById, 
  putCartById, putProductsInCart, 
  deleteProductsInCart, postProductsInCart } from "../controllers/carts.controller.js";
// import CartManager from "../dao/CarritoManagerFS.js";
import { checkRolUser } from "../middlewares/auth.js";

const cartsRoutes = Router()

cartsRoutes.get('/', getCarts)

cartsRoutes.get('/:cId', getCartsById)

cartsRoutes.post('/', postCart)

// Borrar un producto de un carrito puntual
cartsRoutes.delete('/:cId/products/:pId', deleteCartById) 

// Modificar un carrito
cartsRoutes.put('/:cId',  checkRolUser, putCartById)

cartsRoutes.put('/:cId/products/:pId', checkRolUser, putProductsInCart)

cartsRoutes.delete('/:cId', deleteProductsInCart)


cartsRoutes.post("/:cId/product/:pId",  checkRolUser, postProductsInCart)


export default cartsRoutes