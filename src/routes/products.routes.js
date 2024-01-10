import { Router } from "express";
import { productsModel } from "../models/products.model.js"

const productsRoutes = Router()

productsRoutes.get('/', async (req, res) => {
  const { category } = req.query
  try {
    let productos = []
    if(category){
      productos = await productsModel.find({category: category})
    }
    else{
      productos = await productsModel.find()
    }
    res.send({productos})
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No podemos devolver los productos - ${error}`})
  }
})

productsRoutes.get('/:uId', async (req, res) => {
  const { uId } = req.params
  try {
    const product = await productsModel.findOne({_id: uId})
    res.send({product})
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No podemos devolver el producto de ID: ${uId} - ${error}`})
  }
})

productsRoutes.post('/', async (req, res) => {
  try {
    const newProduct = req.body
    const added = await productsModel.create(newProduct)
    res.status(201).json({message: 'Producto añadido'})
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No se pudo añadir el producto - ${error}`})
  }
})

productsRoutes.delete('/:uId', async (req, res) => {
  const { uId } = req.params
  try {
    const productDeleted = await productsModel.deleteOne({_id: uId})
    if(productDeleted.deleteCount > 0){
      return res.send({message: `Producto eliminado correctamente - Id: ${uId}`})
    }
    res.send({message: `Producto NO encontrado - Id: ${uId}`})
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No se pudo eliminar el producto - ${error}`})
  }
})

productsRoutes.put('/:uId', async (req, res) => {
  const { uId } = req.params
  const productToUpdate = req.body
  
  try {
    const update = await productsModel.updateOne({_id: uId}, productToUpdate)
    if(update.modifiedCount > 0){
      return res.send({message: `Producto modificado exitosamente - Id: ${uId}`})
    } else {
      res.status(404).json({message: `Producto NO modificado - Id: ${uId}`})
    }
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No se pudo modificar el producto - ${error}`})
  }
})

/*
productsRoutes.put('/:pid', async (req, res) => {
    const productManager = new ProdManager('./products.json');
    const product = req.body
    await productManager.updateProduct(req.params.pid, product)
    res.status(201).json("Actualizado correctamente")
})

*/

export default productsRoutes