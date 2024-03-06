import ProductDTO from "../../dtos/product.dto.js";


export default class ProductRepository {
    constructor(dao){
        this.dao = dao
    }

    getProducts2 = async(limit, page, query, sort) => {
        console.log("getProducts2")
        const result = await this.dao.get(limit, page, query, sort)
        return result
    }

    createProduct2 = async (product) => {
        console.log("createProducts2")
        const newProduct = new ProductDTO(product)
        const result = await this.dao.addProduct(newProduct)
        return result
    }

}