/*
Clase para trabajar sobre el Carrito
*/
 
import fs from 'fs'

export class CartManager{
    constructor(path){
        this.path = path;
    }

    async getLength() {
        const carts = await this.getCarts()
        return carts.length
    }

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

    async getCarts(){
        try{
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const carts = JSON.parse(data)
            return carts
        } catch (error){
            return []
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

    async getCartById(id){
        const carts = await this.getCarts()
        const cart = carts.find(c => c.id === id)
        if (!cart){
            return console.error('Carrito NO encontrado')
        }
        return cart        
    }

}

export default CartManager

