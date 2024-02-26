import fs from 'fs'
import { productsModel } from "../models/products.model.js"
// import mongoosePaginate from 'mongoose-paginate-v2'


export class ProdManager {
    constructor(path){
        this.path = path;
    }

    async getProducts(limit=10, page=1, query='', sort=''){
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

    async getProductById(id){
        const products = await this.getProducts()
        const product = products.find(p => p.id === id)
        if (!product){
            return console.error('Prod NO encontrado')
        }
        return product        
    }

    async deleteProduct(id){
        const products = await this.getProducts()
        const productsNotDeleted = products.filter(product => product.id !== id)
        await fs.promises.writeFile(this.path, JSON.stringify(productsNotDeleted), 'utf-8')
    }

    async updateProduct(id, productToUpdate){
        const products = await this.getProducts()
        const productId = parseInt(id, 10)
        const updatedProducts = products.map(product => {
            if(product.id === productId){
                return {
                    ...product,
                    ...productToUpdate,
                    id: productId
                }
            }
            return product
        }) 

    await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts), 'utf-8')

    }
}


export default ProdManager
