import { cartsModel } from "../models/carts.model.js"
import CartManager from "../dao/mongo/CarritoManagerMongo.js";
import { cartsServicesRep } from "../dao/repositories/index.js";

/*
export const getCartsOld = async (req, res) => {
    try {
      const carts = await cartsModel.find()
      res.send({carts})
    } catch (error) {
      console.error(error)
      res.status(400).json({message: `No podemos devolver los carritos - ${error}`})
    }
}
*/

export const getCarts = async (req, res) => {
  try {
    const resultado = await cartsServicesRep.getCartsRep()
    if(resultado){
      res.send(resultado)
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    res.status(400).json({message: `No podemos devolver los carritos - ${error}`})
  }
}

/*
export const getCartsByIdOld = async (req, res) => {
  try {
    const { cId } = req.params
    const products = new CartManager()

    const result = await products.getCartById(cId)
    if (result.message="OK"){
      return res.status(200).json(result)
    }
    else {
      res.status(400).json(result)
    }
  } catch (error) {
    res.status(400).json({message: "El carrito no existe"})
  }
}
*/

export const getCartsById = async (req, res) => {
  try {
    const { cId } = req.params
    const resultado = await cartsServicesRep.getCartByIdRep(cId)
    if(resultado){
      res.send(resultado)
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No podemos devolver el carrito de ID: ${cId} - ${error}`})
  }
}

export const postCart = async (req, res) => {
  try {
    const newCart = req.body
    const user = req.session.user
    const resultado = await cartsServicesRep.createCartRep(newCart, user)
    if(resultado){
      res.send(resultado)
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    res.status(400).json({message: `No se pudo añadir el carrito - ${error}`})
  }
}

export const deleteCartById = async (req, res) => {
  const { cId } = req.params
  try {
    const resultado = await cartsServicesRep.delCart(cId)
    if(resultado){
      res.send({resultado})
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No podemos eliminar los productos del Carrtio ID: ${cId} - ${error}`})
  }
}

export const putCartById = async (req, res) => {
  const { cId } = req.params
  const cart = req.body
  const user = req.session.user
  try {
    const resultado = await cartsServicesRep.putCartByIdRep(cId, cart, user)
    if(resultado.modifiedCount > 0){
      res.send({message: "Carro modificado"})
    } else {
      res.status(400).send({message: "No se pudo modificar el carrito"})
    }
  } catch (error) {
    console.error(error)
    res.status(400).send({message: "No se pudo modificar el carrito"})
  }
}


export const putProductsInCart = async (req, res) => {
  const { cId, pId} = req.params
  const {quantity} = req.body
  const user = req.session.user

  try {
    const resultado = await cartsServicesRep.updateProdQuantityRep(cId, pId, quantity, user)
    if(resultado){
      return res.send({resultado})
    } else {
      res.status(404).json({resultado})
    }
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No se pudo modificar el producto - ${error}`})
  }
}

export const deleteProductsInCart = async (req, res) => {
  const { cId } = req.params
  
  try {
    const resultado = await cartsServicesRep.delCart(cId)
    if(resultado){
      res.send({resultado})
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No podemos eliminar los productos del Carrtio ID: ${cId} - ${error}`})
  }
}

export const postProductsInCart = async (req,res)=>{

  try {
    const {cId, pId} = req.params
    const newQuantity =  req.body.quantity
    const resultado = await cartsServicesRep.putProdInCartRep(cId, pId, productToUpdate)
    if(resultado){
      return res.send({resultado})
    } else {
      res.status(404).json({resultado})
    }
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No se pudo agregar el producto - ${error}`})
  }
}

export const confirmCart = async (req, res) => {
  try {
    const user = req.session.user
    const {cId} = req.params
    const resultado = await cartsServicesRep.confCart(cId, user)
    if(resultado){
      res.send(resultado)
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    res.status(400).json({message: `No podemos confirmar el carrito - ${error}`})
  }
}
