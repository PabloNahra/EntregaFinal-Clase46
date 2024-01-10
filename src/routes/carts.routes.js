import { Router } from "express";
import { cartsModel } from "../models/carts.model.js"

const cartsRoutes = Router()

cartsRoutes.get('/', async (req, res) => {
  try {
    const carts = await cartsModel.find()
    res.send({carts})
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No podemos devolver los carritos - ${error}`})
  }
})

cartsRoutes.get('/:uId', async (req, res) => {
  const { uId } = req.params
  try {
    const cart = await cartsModel.findOne({_id: uId})
    res.send({cart})
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No podemos devolver el carrito - Error: ${error}`})
  }
})

cartsRoutes.post('/', async (req, res) => {
  try {
    const newCart = req.body
    const added = await cartsModel.create(newCart)
    res.status(201).json({message: 'Carrito creado exitosamente'})
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No se pudo crear el carrito - ${error}`})
  }
})



/*
cartsRoutes.post('/:cid/product/:pid', async (req, res) => {
    const cartManager = new CartManager('./carts.json');
    await cartManager.addCartProduct(req.params.cid, req.params.pid)
    res.status(201).json("Producto agregado correctamente")
})
*/

export default cartsRoutes