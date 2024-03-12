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
            return {message: 'Producto añadido DAO'}
        } catch (error) {
            console.error(error)
            return {message: `No se pudo añadir el producto DAO - ${error}`}
        }
        
    }

    /* Anterior en FS
        async addProduct(product){
        if (!product.title || !product.description || !product.code || 
            !product.price 
            || !product.stock == undefined || !product.stock == null 
            || !product.category) {
            return console.error('Datos incompletos')   
            }
        
        const available = product.available ?? 1;
        const id = parseInt(await this.getMaxId(), 10) + 1

        const products = await this.getProducts()            
        const newProduct = {
            id: id,
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            available: available,
            stock: product.stock,
            category: product.category,
            thumbnail: product.thumbnail
        }
        
        products.push(newProduct)

        await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8')
    }
    */
    async getProductById(id){
        const product = await productsModel.findOne({_id: id})
        if (!product){
            return console.error('Prod NO encontrado')
        }
        return product        
    }

    /*
    async deleteProductOLD(id){
        const products = await this.getProducts()
        const productsNotDeleted = products.filter(product => product.id !== id)
        await fs.promises.writeFile(this.path, JSON.stringify(productsNotDeleted), 'utf-8')
    }
    */

    
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
            console.log("dento del updateProduct")
            console.log(id)
            console.log(productToUpdate)
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
