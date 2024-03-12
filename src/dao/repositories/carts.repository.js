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

    getCartByIdRep = async(id) => {
        console.log("getCartById - Repository")
        const result = await this.dao.getCartById(id)
        return result
    }

    createCartRep = async (cart) => {
        console.log("create Carts Repo")
        console.log(cart)
        const newCart = cart //new CartDTO(cart)
        //const newCart = new CartDTO(cart)
        console.log("newCart")
        console.log(newCart)
        const result = await this.dao.addCart(newCart)
        console.log("result")
        console.log(result)
        return result
    }

    delCart = async (id) => {
        console.log("Carts Repo")
        const result = await this.dao.deleteAllProductsInCart(id)
        return result
   }

   putCartByIdRep = async (id, cart) => {
    console.log("Update carts Repo")
    const updateCart = cart
    //const updateCart = new CartDTO(cart)
    const result = await this.dao.updateCart(id, updateCart)
    return result
    }

    updateProdQuantityRep = async(cId, pId, quantity) => {
    const result = await this.dao.updateProductInCart(cId, pId, quantity)
    return result
    }

    
    putProdInCartRep = async(cId, pId, quantity) => {
        console.log("Agregar producto en carrito")
        const result = await this.dao.addProductsInCart(cId, pId, quantity)

        return result
        }
    
    confCart = async(cId) => {
        console.log("Confirmar carrito")
        console.log(cId)
        const result = await this.dao.confirm(cId)
        return result
    }

}