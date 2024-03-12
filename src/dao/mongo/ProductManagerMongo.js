//import fs from 'fs'
import { productsModel } from "../../models/products.model.js"
// import mongoosePaginate from 'mongoose-paginate-v2'


export class ProdManager {
    constructor(path){
        this.path = path;
    }

    async get(limit=10, page=1, query='', sort=''){
        try{
            const [code, value] = query.split(':')
            const parseProducts = await productsModel.paginate({[code]: value}, {
                limit, 
                page, 
                sort: sort ? {price: sort} : {}
            })
            parseProducts.payload = parseProducts.docs
            delete parseProducts.docs
            return {message: "OK", ...parseProducts}
        } catch (error){
            return {message: "ERROR", rdo: "No hay productos"}
        }
    }

    async addProduct(product){
        try {
            const added = await productsModel.create(product)
            if (added) {
                return {message: 'Producto añadido DAO'}
            }
        } catch (error) {
            return {message: `No se pudo añadir el producto DAO - ${error}`}
        }
    }

    async getProductById(id){
        const product = await productsModel.findOne({_id: id})
        if (!product){
            return console.error('Prod NO encontrado')
        }
        return product        
    }

    async deleteProduct(id){
        try {
            const productDeleted = await productsModel.deleteOne({_id: id})
            if(productDeleted.deletedCount > 0){
              return {message: `Producto eliminado correctamente - Id: ${id}`}
            } else {
                return {message: `Producto NO encontrado - Id: ${id}`}
            }
          } catch (error) {
            console.error(error)
            return {message: `No se pudo eliminar el producto - ${error}`}
         }
        }

    async updateProduct(id, productToUpdate){
        try {
            const update = await productsModel.updateOne({_id: id}, productToUpdate)
            if(update.modifiedCount > 0) {
              return {message: `Producto modificado exitosamente - Id: ${id}`}
            } else {
              return {message: `Producto NO modificado - Id: ${id}`}
            }
          } catch (error) {
            console.error(error)
            return {message: `No se pudo modificar el producto - ${error}`}
          }
    }
}


export default ProdManager
