import { Router } from "express";
// import { ProdManager } from '../dao/ProductManager.js'
import ProdManager from "../dao/fs/ProductManagerFS.js";

const productsRoutes = Router()

productsRoutes.get('/', async (req, res) => {
    try {
        let limit = parseInt(req.query.limit, 10);
        
        const productManager = new ProdManager('./products.json');
        let products = await productManager.getProducts();
        // Si no se configura limite enviamos todos los productos
        if(!limit){
          return res.send(products);
        }
        // Si se configuro limite solo enviamos esa X cantidad de productos
        let productsLimit = products.slice(0, limit)
        return res.send(productsLimit);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
      }
})

productsRoutes.get('/:pid', async (req, res) => {
    try {
        const productManager = new ProdManager('./products.json');
        let product = await productManager.getProductById(parseInt(req.params.pid));
        // Si no se encontro el producto por id
        if(!product){
          return res.send('No se encontró el producto');
        }
        // Si se encontro el producto
        return res.send({product});
      } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
      }
})

productsRoutes.post('/', async (req, res) => {
    const productManager = new ProdManager('./products.json');
    const product = req.body
    //    products.push(product)
    await productManager.addProduct(product)
    res.status(201).json("Creado correctamente")
})

productsRoutes.put('/:pid', async (req, res) => {
    const productManager = new ProdManager('./products.json');
    const product = req.body
    await productManager.updateProduct(req.params.pid, product)
    res.status(201).json("Actualizado correctamente")
})

productsRoutes.delete('/:pid', async (req, res) => {
    const productManager = new ProdManager('./products.json');
    await productManager.deleteProduct(parseInt(req.params.pid, 10))
    res.status(201).json("Eliminado correctamente")
})


export default productsRoutes