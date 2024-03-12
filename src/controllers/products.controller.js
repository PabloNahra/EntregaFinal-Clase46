import { productsServicesRep } from "../dao/repositories/index.js";

export const getProducts = async (req, res) => {
    try {
      const { limit=10, page=1, query='', sort= ''} = req.query
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