import ProductDTO from "../../dtos/product.dto.js";


export default class ProductRepository {
    constructor(dao){
        this.dao = dao
    }

    getProd = async(limit, page, query, sort) => {
        const result = await this.dao.get(limit, page, query, sort)
        return result
    }

    getProdById = async(id) => {
        const result = await this.dao.getProductById(id)
        return result
    }

    createProd = async (product) => {
        const newProduct = new ProductDTO(product)
        const result = await this.dao.addProduct(newProduct)
        return result
    }

    delProd = async (id) => {
        const result = await this.dao.deleteProduct(id)
        return result
    }

    updateProd = async (id, product) => {
        const updateProduct = new ProductDTO(product)
        const result = await this.dao.updateProduct(id, updateProduct)
        return result
    }
}