import { Router } from "express";
import { CartManager } from '../dao/fs/CarritoManagerFS.js'

const cartsRoutes = Router()

cartsRoutes.get('/:cid', async (req, res) => {
    try {
        const cartManager = new CartManager('./carts.json');
        let cart = await cartManager.getCartById(parseInt(req.params.cid));
        // Si no se encontro el carrito por id
        if(!cart){
          return res.send('No se encontró el carrito');
        }
        // Si se encontro el carrito
        return res.send({cart});
      } catch (error) {
        console.error('Error al obtener los carritos:', error);
        res.status(500).send('Error interno del servidor');
      }
})

cartsRoutes.post('/', async (req, res) => {
    const cartManager = new CartManager('./carts.json');
    const cart = req.body
    await cartManager.addCart(cart)
    res.status(201).json("Carrito creado correctamente")
})

cartsRoutes.post('/:cid/product/:pid', async (req, res) => {
    const cartManager = new CartManager('./carts.json');
    await cartManager.addCartProduct(req.params.cid, req.params.pid)
    res.status(201).json("Producto agregado correctamente")
})

export default cartsRoutes