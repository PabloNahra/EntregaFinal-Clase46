import fs from 'fs'
import { cartsModel } from '../../models/carts.model.js'
import mongoose from 'mongoose';
import { ProdManager } from "../mongo/ProductManagerMongo.js"; 
import ProductDTO from "../../dtos/product.dto.js";
import { TicketManager } from "../mongo/TicketManagerMongo.js"; 
import TicketDTO from '../../dtos/ticket.dto.js';


const prodManager = new ProdManager(); 
const tkManager = new TicketManager(); 


export class CartManager{
    constructor(path){
        this.path = path;
    }

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
        try {
            const added = await cartsModel.create(cart)
            return {message: 'Carrito creado exitosamente'}
          } catch (error) {
            console.error(error)
            return {message: `No se pudo crear el carrito - ${error}`}
          }
    }

    async addCartProduct(cartId, productId){
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

    async updateProductInCart(cId, pId, quantity) {
        if (!quantity) {
            return false;
        }
        try {
            const cart = await cartsModel.findOne({ _id: cId });
            if (!cart) {
                return false;
            }
            const pIdObject = new mongoose.Types.ObjectId(pId);
            let productIndex = -1;
    
            cart.products.forEach((product, index) => {
                if (product.product.equals(pIdObject)) {
                    productIndex = index;
                }
            });
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                await cart.save();
                return true;
            } else {
                return false; 
            }
        } catch (error) {
            console.error(error);
            return false;
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

    async confirm(cId, user) {
        console.log("Mongo confirm")
        try {
            const prodInCart = await this.getCartById(cId)
            const newCart = prodInCart
            let montoCompra = 0
            let quantityTotal = 0

            for (const prod of prodInCart.rdo) {
                let quantityConfirm = 0

                // Consultar el stock del producto
                const stockProducto = prod.product.stock
                
                // Si tengo stock sumar a la compra a confirmar
                if (prod.quantity <= stockProducto) {
                    quantityConfirm = prod.quantity;
                    console.log(quantityConfirm)
                    console.log(prod.product.price)
                    quantityTotal += quantityConfirm
                    montoCompra += quantityConfirm * prod.product.price
                } else if (stockProducto > 0) {
                    quantityConfirm = stockProducto;
                    console.log(quantityConfirm)
                    console.log(prod.product.price)
                    quantityTotal += quantityConfirm
                    montoCompra += quantityConfirm * prod.product.price
                } else {
                    quantityConfirm = 0;
                }
                
                // Descontar del stock del producto (ojo con negativos) y del carrito
                if (quantityConfirm != 0){
                    // stock a actualizar en el producto
                    let stock = stockProducto - quantityConfirm
                    let productUpdateStock = { stock: stock }
                    let updateProduct = new ProductDTO(productUpdateStock)
                    await prodManager.updateProduct(prod.product._id.toString(), updateProduct)

                    // Reviso stock restante en el carrito
                    let stockInCartRestante = prod.quantity - quantityConfirm

                    // Actualizo carrito
                    if(stockInCartRestante === 0){
                        this.deleteProductInCart(cId, prod.product._id.toString())
                    } else if (stockInCartRestante > 0) {
                        this.updateProductInCart(cId, prod.product._id.toString(), stockInCartRestante)
                    }
                }
            }
    
            // Actualizar el ticket
            // Confirmar la compra si tenemos alguno producto -- Ticket
            if (quantityTotal != 0){
                let tk = {
                    "amount": montoCompra,
                    "purcharser": user.email
                }
                let tkNew = new TicketDTO(tk)
                const tkresult = await tkManager.addTk(tkNew)
                return tkresult
            } else {
                return {message: "El carrito no tiene productos con stock para confirmarlo"}
            }
        } catch (error) {
            console.error(error)
            return false
        }
    }
}

export default CartManager

