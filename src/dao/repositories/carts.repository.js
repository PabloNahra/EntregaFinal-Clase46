//import ProductDTO from "../../dtos/product.dto.js";
import CartDTO from "../../dtos/cart.dto.js";


export default class CartRepository {
    constructor(dao){
        this.dao = dao
    }

    getCartsRep = async() => {
        const result = await this.dao.get()
        return result
    }

    getCartByIdRep = async(id) => {
        const result = await this.dao.getCartById(id)
        return result
    }

    getCartByUserEmailRep = async(uEmail) => {
        const result = await this.dao.getCartByUserEmail(uEmail)
        return result
    }

    createCartRep = async (cart, user) => {
        const newCart = cart //new CartDTO(cart)
        const result = await this.dao.addCart(newCart, user)
        return result
    }

    delCart = async (id) => {
        const result = await this.dao.deleteAllProductsInCart(id)
        return result
   }

   delProdudctInCartRep = async (cId, pId) => {
    const result = await this.dao.deleteProductInCart(cId, pId)
    return result
}

   putCartByIdRep = async (id, cart, user) => {
    const updateCart = cart
    const result = await this.dao.updateCart(id, updateCart, user)
    return result
    }

    updateProdQuantityRep = async(cId, pId, quantity, user) => {
    const result = await this.dao.updateProductInCart(cId, pId, quantity, user)
    return result
    }

    
    putProdInCartRep = async(cId, pId, quantity) => {
        const result = await this.dao.addProductsInCart(cId, pId, quantity)
        return result
        }
    
    confCart = async(cId, user) => {
        const result = await this.dao.confirm(cId, user)
        return result
    }

}