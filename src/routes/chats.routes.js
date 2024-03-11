import { Router } from "express";
import { chatsModel } from "../models/chats.model.js"
import { checkRolUser } from "../middlewares/auth.js";



const chatsRoutes = Router()


chatsRoutes.post('/', checkRolUser, async (req, res) => {
  console.log(req.body)
  try {
    const newMessage = req.body
    const added = await chatsModel.create(newMessage)
    console.log("Mensaje creado")
    res.status(201).json({message: 'Mensaje creado exitosamente'})
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No se pudo agregar el mensaje - ${error}`})
  }
})

/*
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
*/

export default chatsRoutes