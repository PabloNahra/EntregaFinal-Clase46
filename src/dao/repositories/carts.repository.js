//import ProductDTO from "../../dtos/product.dto.js";
import CartDTO from "../../dtos/cart.dto.js";


export default class CartRepository {
    constructor(dao){
        this.dao = dao
    }

    getCartsRep = async() => {
        console.log("getCarts - Repository")
        const result = await this.dao.get()
        return result
    }



}