import fs from 'fs'
import { cartsModel } from '../../models/carts.model.js'
import mongoose from 'mongoose';
import { ProdManager } from "../mongo/ProductManagerMongo.js"; 
import ProductDTO from "../../dtos/product.dto.js";
import { TicketManager } from "../mongo/TicketManagerMongo.js"; 
import TicketDTO from '../../dtos/ticket.dto.js';
import { productsModel } from '../../models/products.model.js';
import { userModel } from '../../models/user.model.js';




const prodManager = new ProdManager(); 
const tkManager = new TicketManager(); 

export class CartManager {
  constructor(path) {
    this.path = path;
  }

  async get() {
    try {
      const carts = await cartsModel.find();
      return { carts };
    } catch (error) {
      console.error(error);
      return { message: `No podemos devolver los carritos - ${error}` };
    }
  }

  async addCart(cart, user) {
    try {
      // Chequeo que los productos existan en la base de datos
      for (const item of cart.products) {
        const productId = item.product;

        // Consultar el producto en la base de datos
        const product = await productsModel.findById(productId);
        if (!product) {
          return { message: `Producto inexistente ${productId}` };
        }
      }

      // Si el usuario es Premium, controlar que ningun producto sea de él
      if (user.role.toUpperCase() === "PREMIUM") {
        // Validar que ningún producto en el carrito pertenezca al usuario
        for (const item of cart.products) {
          const productId = item.product;

          // Consultar el producto en la base de datos
          const product = await productsModel.findById(productId);
          if (product && product.owner && product.owner === user.email) {
            return {
              message:
                "Revise los productos. Un usuario Premium NO puede agregar productos que le pertenecen",
            };
          }
        }
      }

      // Busco el id del usuario
      const user_id_response = await fetch(
        `http://localhost:8080/api/users/getUserIdByEmail/${user.email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let uId = null;
      if (user_id_response.ok) {
        const responseData = await user_id_response.json();
        uId = responseData.userId;
      }
  
      cart.user_id = uId;
      cart.status = 'EN PROCESO'
      const added = await cartsModel.create(cart);
      if (added) {
        return { message: "Carrito creado exitosamente" };
      }
    } catch (error) {
      console.error(error);
      return { message: `No se pudo crear el carrito - ${error}` };
    }
  }

  /* FS
  async addCartProduct(cartId, productId) {
    const idCart = parseInt(cartId, 10);
    const idProd = parseInt(productId, 10);
    const carts = await this.getCarts();

    // Verifico si el carrito existe
    const existingCart = carts.find((cart) => cart.id === idCart);

    if (existingCart) {
      // El carrito ya existe, verifica si el productId ya está en la lista de productos
      const existingProduct = existingCart.products.find(
        (product) => product.productId === idProd
      );

      if (existingProduct) {
        // El producto ya existe, incrementa la cantidad
        existingProduct.quantity += 1;
      } else {
        // El producto no existe, agrégalo con una cantidad de 1
        existingCart.products.push({ productId: idProd, quantity: 1 });
      }
      // Guarda los cambios en el archivo o donde almacenes tus carritos
      await fs.promises.writeFile(this.path, JSON.stringify(carts), "utf-8");
    } else {
      console.error(`Error: No existe el carrito con ID ${cartId}.`);
      return "NO EXISTE";
    }
  }
  */

  async addProductsInCart(cId, pId, quantity) {
    try {
      const cart = await cartsModel.findOne({ _id: cId });
      if (cart) {
        const existingProducts = cart.products.find(
          (product) => product.product.toString() === pId
        );
        if (existingProducts) {
          existingProducts.quantity += quantity;
        } else {
          cart.products.push({ product: pId, quantity });
        }
        cart.status = 'EN PROCESO'
        await cart.save();
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  
  // Elimino un producto dentro de un carrito
  async deleteProductInCart(cId, pId) {
    try {
      const result = await cartsModel.updateOne(
        { _id: cId },
        {
          $pull: { products: { product: new mongoose.Types.ObjectId(pId) } },
        }
      );
      if (result.modifiedCount > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getCartById(id) {
    try {
      const cart = await cartsModel
        .findOne({ _id: id })
        .populate("products.product");
      if (cart) {
        return { message: "OK", rdo: cart.products };
      } else {
        return {
          message: "ERROR",
          rdo: "El carrito NO existe o no tiene productos",
        };
      }
    } catch (error) {
      console.error(error);
      return { message: "ERROR", rdo: "Error" };
    }
  }

  async getCartByUserEmail(uEmail) {
    try {

      // Busco el id del user por el email
      const userId = await userModel.findOne({email: uEmail}).select('_id')
      
      // Busco los carritos por Id e User
      const carts = await cartsModel.find({user_id: userId})
      
      if (carts) {
        return { message: "OK", rdo: carts, status: 201 };
      } else {
        return {
          message: "ERROR",
          rdo: "El usuario no posee carritos",
          status: 403
        };
      }
    } catch (error) {
      console.error(error);
      return { message: "ERROR", rdo: "Error" };
    }
  }


  async updateCart(cId, cart, user) {
    try {
      // Si el usuario es Premium, controlar que ningun producto sea de él
      if (user.role.toUpperCase() === "PREMIUM") {
        // Validar que ningún producto en el carrito pertenezca al usuario
        for (const item of cart.products) {
          const productId = item.product;

          // Consultar el producto en la base de datos
          const product = await productsModel.findById(productId);
          if (product && product.owner && product.owner === user.email) {
            return { message: "Revise los productos. Un usuario Premium NO puede agregar productos que le pertenecen" };
          }
        }
      }

      const resultado = await cartsModel.updateOne({ _id: cId }, cart);
      return resultado;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async updateProductInCart(cId, pId, quantity, user) {
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

  async deleteAllProductsInCart(id) {
    try {
      const deleted = await cartsModel.updateOne(
        { _id: id },
        {
          products: [], status: 'VACIO'
        }
      );
      if (deleted.modifiedCount > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async confirm(cId, user) {
    try {
      const prodInCart = await this.getCartById(cId);
      const newCart = prodInCart;
      let montoCompra = 0;
      let quantityTotal = 0;
      const prodSinStock = [];

      for (const prod of prodInCart.rdo) {
        let quantityConfirm = 0;

        // Consultar el stock del producto
        const stockProducto = prod.product.stock;

        // Si tengo stock sumar a la compra a confirmar
        // Puedo completar el total de las unidades del producto
        if (prod.quantity <= stockProducto) {
          quantityConfirm = prod.quantity;

          quantityTotal += quantityConfirm;
          montoCompra += quantityConfirm * prod.product.price;
          // Puedo entregar un parcial de las unidades del producto
        } else if (stockProducto > 0) {
          quantityConfirm = stockProducto;
          quantityTotal += quantityConfirm;
          montoCompra += quantityConfirm * prod.product.price;
          prodSinStock.push(prod.product._id);
        } else {
          quantityConfirm = 0;
          prodSinStock.push(prod.product._id);
        }

        // Descontar del stock del producto (ojo con negativos) y del carrito
        if (quantityConfirm != 0) {
          // stock a actualizar en el producto
          let stock = stockProducto - quantityConfirm;
          let productUpdateStock = { stock: stock };
          let updateProduct = new ProductDTO(productUpdateStock);
          await prodManager.updateProduct(
            prod.product._id.toString(),
            updateProduct
          );

          // Reviso stock restante en el carrito
          let stockInCartRestante = prod.quantity - quantityConfirm;

          // Actualizo carrito
          // Si complete la entrega del producto (todas las unidades)
          if (stockInCartRestante === 0) {
            this.deleteProductInCart(cId, prod.product._id.toString());
          }
          // Si complete la entrega del producto parcialmente (algunas unidades)
          else if (stockInCartRestante > 0) {
            this.updateProductInCart(
              cId,
              prod.product._id.toString(),
              stockInCartRestante
            );
          }
        }
      }

      // Actualizar el ticket
      // Confirmar la compra si tenemos alguno producto -- Ticket
      if (quantityTotal != 0) {
        let tk = {
          amount: montoCompra,
          purcharser: user.email,
        };
        let tkNew = new TicketDTO(tk);
        const tkresult = await tkManager.addTk(tkNew);
        return tkresult;
      } else if (prodSinStock != 0) {
        // Devolver el arreglo con los productos que no se pudieron entregar
        return {
          message: `No se pudieron entregar estos producto  - IDs: ${prodSinStock}`,
        };
      } else {
        return {
          message: `No se pudo entregar ningun producto - ${prodSinStock}`,
        };
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export default CartManager