import { productsServicesRep } from "../dao/repositories/index.js";
import CustomErrors from '../services/errors/CustomError.js'
import ErrorEnum from "../services/errors/error.enum.js";
import { generateProductErrorInfo } from "../services/errors/info.js";


function isValidEmail(email) {
  // Expresión regular para validar un correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Verificar si la cadena cumple con el formato de correo electrónico
  return emailRegex.test(email);
}

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
      // Agrego el owner con el Role del usuario
      if(req.session.user.role.toUpperCase()==='PREMIUM'){
        newProduct.owner = req.session.user.email;
      }else{
        newProduct.owner = 'ADMIN';
      }
      console.log("newProduct.owner")
      console.log(newProduct.owner)

      if (!newProduct.title || !newProduct.description 
        || !newProduct.code 
        || !newProduct.price 
        || !newProduct.stock == undefined || !newProduct.stock == null 
        || !newProduct.category 
        || !newProduct.thumbnail) {
          CustomErrors.createError({
            name: "Fallo en la creación de producto",
            cause: generateProductErrorInfo(newProduct),
            message: "Error al intentar crear el producto",
            code: ErrorEnum.INVALID_TYPE_ERROR
          })
        }
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
