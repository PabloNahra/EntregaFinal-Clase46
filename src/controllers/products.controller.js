// import ProdManager from "../dao/mongo/ProductManagerMongo.js";
import { productsModel } from "../models/products.model.js"
import { Products } from "../dao/factory/factory.js";
import ProductDTO  from "../dtos/product.dto.js";
import { productsServicesRep } from "../dao/repositories/index.js";

const ProductServices = new Products()

export const getProducts = async (req, res) => {
    try {
      const { limit=10, page=1, query='', sort= ''} = req.query
      // const products = new ProdManager()
      //const resultado = await products.getProducts(limit, page, query, sort)
      //const resultado = await ProductServices.get(limit, page, query, sort)
      const resultado = await productsServicesRep.getProd(limit, page, query, sort)
  
      if(resultado){
        res.send(resultado)
      } else {
        res.status(400).json(resultado)
      }
      
    } catch (error) {
      res.status(400).json({message: `No podemos devolver los productos - ${error}`})
    }
  }

export const getProductsById = async (req, res) => {
    const { uId } = req.params
    try {
      const resultado = await productsServicesRep.getProdById(uId)
      if(resultado){
        res.send({resultado})
      } else {
        res.status(400).json(resultado)
      }
    } catch (error) {
      console.error(error)
      res.status(400).json({message: `No podemos devolver el producto de ID: ${uId} - ${error}`})
    }
}

export const postProduct = async (req, res) => {
    try {
      const newProduct = req.body
      //const newProduct = new ProductDTO(req.body)
      const resultado = await productsServicesRep.createProd(newProduct)

      if(resultado){
        res.send(resultado)
      } else {
        res.status(400).json(resultado)
      }
    } catch (error) {
      res.status(400).json({message: `No se pudo añadir el producto - ${error}`})
    }
}


/* Logica en controller
export const postProduct = async (req, res) => {
    try {
      //const newProduct = req.body
      const newProduct = new ProductDTO(req.body)
      const added = await productsModel.create(newProduct)


      res.status(201).json({message: 'Producto añadido'})
    } catch (error) {
      console.error(error)
      res.status(400).json({message: `No se pudo añadir el producto - ${error}`})
    }
}
*/

// Delete all
export const deleteProduct2 = async (req, res) => {
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
}


export const deleteProduct = async (req, res) => {
  const { uId } = req.params
  try {
    const resultado = await productsServicesRep.delProd(uId)
    if(resultado){
      res.send({resultado})
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No podemos devolver el producto de ID: ${uId} - ${error}`})
  }
}

export const putProductOld = async (req, res) => {
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
  }

export const putProduct = async (req, res) => {
    const { uId } = req.params
    const productToUpdate = req.body
    try {
      const resultado = await productsServicesRep.updateProd(uId, productToUpdate)
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