import { Router } from "express";
import { productsModel } from "../models/products.model.js"
import ProdManager from "../dao/ProductManagerMongo.js";


const productsRoutes = Router()

productsRoutes.get('/', async (req, res) => {
  try {
    const { limit=10, page=1, query='', sort= ''} = req.query
    const products = new ProdManager()
    const resultado = await products.getProducts(limit, page, query, sort)

    if(resultado){
      res.send(resultado)
    } else {
      res.status(400).json(resultado)
    }
    
  } catch (error) {
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

export default productsRoutes