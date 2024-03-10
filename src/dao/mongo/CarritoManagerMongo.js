import fs from 'fs'
// import { cartsModel } from '../../models/carts.model.js';
//import { cartsModel } from '../src/models/carts.model.js';
import { cartsModel } from '../../models/carts.model.js'
import mongoose from 'mongoose';


export class CartManager{
    constructor(path){
        this.path = path;
    }

/*
    async getLength() {
        const carts = await this.getCarts()
        return carts.length
    }
    */

    /*
    async getMaxId() {
        const carts = await this.getCarts();
    
        if (carts.length === 0) {
            return 0; // Si no hay elementos, devuelve 0 o cualquier valor predeterminado
        }
    
        const maxId = carts.reduce((max, cart) => {
            return cart.id > max ? cart.id : max;
        }, carts[0].id);
    
        return maxId;
    }
    */

    async get(){
        try {
            const carts = await cartsModel.find()
            return {carts}
          } catch (error) {
            console.error(error)
            return {message: `No podemos devolver los carritos - ${error}`}
          }
    }

    async addCart(cart){
        if (!cart.products) {
            return console.error('Datos incompletos')   
            }
        
        const id = parseInt(await this.getMaxId(), 10) + 1

        const carts = await this.getCarts()            
        const newCart = {
            id: id,
            products: cart.products
        }
        
        carts.push(newCart)

        await fs.promises.writeFile(this.path, JSON.stringify(carts), 'utf-8')
    }

    async addCartProduct(cartId, productId){
        console.log(cartId)
        console.log(productId)
        const idCart = parseInt(cartId, 10)
        const idProd = parseInt(productId, 10)

        const carts = await this.getCarts()

        // Verifico si el carrito existe
        const existingCart = carts.find(cart => cart.id === idCart);

        if (existingCart) {
            console.log("existe el carrito")
            // El carrito ya existe, verifica si el productId ya está en la lista de productos
            const existingProduct = existingCart.products.find(product => product.productId === idProd);

            if (existingProduct) {
                // El producto ya existe, incrementa la cantidad
                console.log("existe el producto")
                existingProduct.quantity += 1;
            } else {
                // El producto no existe, agrégalo con una cantidad de 1
                console.log("NO existe el producto")
                existingCart.products.push({productId: idProd, quantity: 1 });
            }
            // Guarda los cambios en el archivo o donde almacenes tus carritos
            console.log("Grabo los cambios")
            console.log(carts)
            await fs.promises.writeFile(this.path, JSON.stringify(carts), 'utf-8');

        } else {
            console.error(`Error: No existe el carrito con ID ${cartId}.`);
            return "NO EXISTE";
        }
    }

    async addProductsInCart(cId, pId, quantity) {
        try {
          const cart = await cartsModel.findOne({_id: cId});
          if(cart){
            const existingProducts = cart.products.find(product => product.product.toString() === pId);
            if(existingProducts){
              existingProducts.quantity += quantity;
            }
            else{
              cart.products.push({product: pId, quantity});
            }
            await cart.save();
            return true;
          }
          else{
            return false;
          }
        } catch (e) {
          return false;
        }
      }
    // Elimino un producto dentro de un carrito
    async deleteProductInCart(cId, pId){
        try {
            const result = await cartsModel.updateOne({_id: cId}, {
                $pull: {products: {product: new mongoose.Types.ObjectId(pId)}}
            })
            if(result.modifiedCount > 0){
                return true
            } else {
                return false
            }
            
        } catch (error) {
            console.error(error)
            return false
        }
    }

    async getCartById(id){
        try {
            const cart = await cartsModel.findOne({_id: id}).populate('products.product')
            if (cart){
                return {message: "OK", rdo: cart.products}
            }
            else {
                return {message: "ERROR", rdo: "El carrito NO existe o no tiene productos"}
            }
        } catch (error) {
            console.error(error)
            return {message: "ERROR", rdo: "Error"}
        }

    }

    async updateCart(cId, cart){
         try {
            const resultado = await cartsModel.updateOne({_id: cId}, cart)
            return resultado
         } catch (error) {
            console.error(error)
            return error            
         }
    }

    async updateProductInCart(cId, pId, quantity){
        if(!quantity){
            return false
        }
        try {
            const cart = await cartsModel.findOne({_id: cId})
            if(!cart){
                return false
            }
            const product = cart.products.find(product => product.product.toString() == pId)
            console.log(product)
            if(!product){
                return false
            }
            product.quantity = quantity
            await cart.save()
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    async deleteAllProductsInCart (id){
        try {
            const deleted = await cartsModel.updateOne({_id: id}, {
                products: []
            })
            if(deleted.modifiedCount > 0){
                return true
            }
            else{
                return false
            }
        } catch (error) {
            console.error(error)
            return false
            
        }
    }

}

export default CartManager

