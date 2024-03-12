import fs from 'fs'
// import { cartsModel } from '../../models/carts.model.js';
//import { cartsModel } from '../src/models/carts.model.js';
import { cartsModel } from '../../models/carts.model.js'
import mongoose from 'mongoose';
//import { getProductsById } from '../../controllers/products.controller.js';
//import {getProductById} from '..'
import { ProdManager } from "../mongo/ProductManagerMongo.js"; // Asegúrate de que la ruta sea correcta

const prodManager = new ProdManager(); // Crear una instancia de ProdManager


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
        console.log("addCart en Carrito Manager")
        try {
            const added = await cartsModel.create(cart)
            console.log(added)
            return {message: 'Carrito creado exitosamente'}
          } catch (error) {
            console.error(error)
            return {message: `No se pudo crear el carrito - ${error}`}
          }
    }

    async addCartProduct(cartId, productId){
        console.log("AddCat")
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
                //return {message: "OK", rdo: cart.products}
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

    async updateProductInCartOld(cId, pId, quantity){
        console.log("updateProductInCart - Carrito Manager")
        console.log(cId)
        console.log(pId)
        console.log(quantity)
        if(!quantity){
            return false
        }
        try {
            const cart = await cartsModel.findOne({_id: cId})
            console.log("cart")
            console.log(cart)
            console.log("pId")
            console.log(pId)
            console.log(typeof pId)
            console.log("cart.products[0]._id")
            //console.log(typeof cart.products._Id)
            console.log(cart.products[0]._id)
            if(!cart){
                return false
            }
            //const product = cart.products.find(product => product._Id.toString === pId)
            //const product = cart.products.find(product => product._id.equals(mongoose.Types.ObjectId(pId)))
            /*
            const product = cart.products.find(product => product._id.equals(new mongoose.Types.ObjectId(pId)));

            console.log("product de la constante")
            console.log(product)
            if(!product){
                return false
            }
            product.quantity = quantity
            //await cart.products.save()
            await cart.save()
            return true
            */
            const productIndex = cart.products.findIndex(product => product.product.equals(new mongoose.Types.ObjectId(pId)));

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                await cart.save();
                return true;
            } else {
                return false; // Producto no encontrado en el carrito
            }
            
        } catch (error) {
            console.error(error)
            return false
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

            console.log(pIdObject)
            console.log(cart.products)
    
            cart.products.forEach((product, index) => {
                if (product.product.equals(pIdObject)) {
                    console.log("coincide pId")
                    productIndex = index;
                    console.log("productIndex:", productIndex);
                }
            });

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                console.log("cart a salvar")
                console.log(cart)
                await cart.save();
                return true;
            } else {
                return false; // Producto no encontrado en el carrito
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

    async confirm(cId) {
        console.log("Mongo confirm")
        const compraConfirmada = []
        try {
            console.log("recorrer productos")
            const prodInCart = await this.getCartById(cId)
            console.log(prodInCart)
            const newCart = prodInCart
    
            for (const product of prodInCart.rdo) {
                let quantityConfirm = 0

                console.log(product);
                // Consultar el stock del producto
                const stockProducto = await prodManager.getProductById(product._id); // Llamar a la función getProductById del ProdManager
                console.log(stockProducto);
                console.log(stockProducto.stock);
                
                // Si tengo stock sumar a la compra a confirmar
                if (product.quantity <= stockProducto.stock) {
                    console.log("Hay stock para todo lo comprado");
                    quantityConfirm = product.quantity;
                } else if (stockProducto.stock > 0) {
                    console.log("Hay stock para un parcial de lo comprado");
                    quantityConfirm = stockProducto.stock;
                } else {
                    console.log("No hay stock");
                    quantityConfirm = 0;
                }
                
                // Descontar del stock del producto (ojo con negativos) y del carrito
                if (quantityConfirm != 0){
                    const stock = stockProducto.stock - quantityConfirm
                    console.log("stock")
                    console.log(stock)
                    const productUpdateStock = {stock}
                    prodManager.updateProduct(product._id, productUpdateStock)
                }

                // El sobrante acumularlo para actualizar el total del carrito
            }
    
            // Confirmar la compra si tenemos alguno producto
            // Actualizar el carrito con lo restante
    
        } catch (error) {
            console.error(error)
            return false
        }
    }
    
}

export default CartManager

