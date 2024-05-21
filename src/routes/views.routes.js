import { Router } from "express";
import ProdManager from "../dao/mongo/ProductManagerMongo.js";
import {
  checkAuth,
  checkExistingUser,
  applyPolicies,
} from "../middlewares/auth.js";
import CartManager from "../dao/mongo/CarritoManagerMongo.js";
import { productsModel } from "../models/products.model.js";

const viewsRoutes = Router();
const prodManager = new ProdManager();
const cartManager = new CartManager();

viewsRoutes.get("/", checkAuth, (req, res) => {
  const { user } = req.session;
  res.render("index", user);
});

viewsRoutes.get("/login", checkExistingUser, (req, res) => {
  res.render("login");
});

viewsRoutes.get("/register", checkExistingUser, (req, res) => {
  res.render("register");
});

viewsRoutes.get("/chats", checkAuth, (req, res) => {
  res.render("chats");
});

viewsRoutes.get("/products", checkAuth, async (req, res) => {
  try {
    const { page } = req.query;
    const { user } = req.session;
    const products = await prodManager.get(10, page);

    res.render("products", { user, products });
  } catch (error) {
    res.status(500).send("Error interno del servidor");
  }
});

viewsRoutes.get("/cart/:cId", checkAuth, async (req, res) => {
  try {
    const { user } = req.session;
    const { cId } = req.params;
    let ultCart;

    // Obtener el correo electrónico del usuario
    const uEmail = user.email;

    // Obtener los carritos del usuario por su correo electrónico
    const userCarts = await cartManager.getCartByUserEmail(uEmail);

    // Verificar si se obtuvieron correctamente los carritos del usuario
    if (userCarts.message === "OK") {
      const carritos = userCarts.rdo;

      // Filtrar los carritos según los estados y el _id  que llega por parametros
      const filteredCarts = carritos.filter((cart) => {
        const status = cart.status ? cart.status.toUpperCase() : null;
        return (
          status !== "FINALIZADO" &&
          status !== "CANCELADO" &&
          cart._id.toString() === cId
        );
      });
   
      // Tomar el carrito más reciente si hay alguno después de filtrar y ordenar
      if (filteredCarts.length > 0) {
        ultCart = filteredCarts[0];

        // Buscar los detalles de los productos asociados al carrito
        const productsDetails = await Promise.all(
          ultCart.products.map(async (productItem) => {
            const product = await productsModel.findById(productItem.product);
            return {
              product: {
                _id: product._id,
                title: product.title,
                price: product.price,
              },
              quantity: productItem.quantity,
            };
          })
        );

        // Crear un nuevo array de productos con los detalles actualizados
        const updatedProducts = ultCart.products.map((productItem, index) => {
          return {
            product: productsDetails[index].product,
            quantity: productItem.quantity,
            _id: productItem._id,
          };
        });

        // Asignar el nuevo array de productos a ultCart.products
        ultCart.productsDetails = updatedProducts;
      } else {
        ultCart = null; // Si no hay carritos después de filtrar y ordenar
      }
    }

    // Renderizar la vista cart.handlebars con los datos del usuario y del carrito
    res.render("cart", { user, cart: ultCart, cId });
  } catch (error) {
    // Manejar errores
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Vista de proceso de pago
viewsRoutes.get("/payment-process/:cId", checkAuth, async (req, res) => {
  try {
    const { user } = req.session;
    const { cId } = req.params;
    let paymentCart;

/*
    // Obtener el correo electrónico del usuario
    const uEmail = user.email;

    // Obtener los carritos del usuario por su correo electrónico
    const userCarts = await cartManager.getCartByUserEmail(uEmail);

    // Verificar si se obtuvieron correctamente los carritos del usuario
    if (userCarts.message === "OK") {
      const carritos = userCarts.rdo;

      // Filtrar los carritos según los estados y el _id  que llega por parametros
      const filteredCarts = carritos.filter((cart) => {
        const status = cart.status ? cart.status.toUpperCase() : null;
        return (
          status !== "FINALIZADO" &&
          status !== "CANCELADO" &&
          cart._id.toString() === cId
        );
      });
   
      // Tomar el carrito más reciente si hay alguno después de filtrar y ordenar
      if (filteredCarts.length > 0) {
        paymentCart = filteredCarts[0];

        // Buscar los detalles de los productos asociados al carrito
        const productsDetails = await Promise.all(
          paymentCart.products.map(async (productItem) => {
            const product = await productsModel.findById(productItem.product);
            return {
              product: {
                _id: product._id,
                title: product.title,
                price: product.price,
              },
              quantity: productItem.quantity,
            };
          })
        );

        // Crear un nuevo array de productos con los detalles actualizados
        const updatedProducts = paymentCart.products.map((productItem, index) => {
          return {
            product: productsDetails[index].product,
            quantity: productItem.quantity,
            _id: productItem._id,
          };
        });

        // Asignar el nuevo array de productos a paymentCart.products
        paymentCart.productsDetails = updatedProducts;
      } else {
        paymentCart = null; // Si no hay carritos después de filtrar y ordenar
      }
    }
*/
    // Renderizar la vista cart.handlebars con los datos del usuario y del carrito
    //res.render("payment-process", { paymentCart });
    res.render("payment-process", { cId });
  } catch (error) {
    // Manejar errores
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Vista de confirmación de pago
viewsRoutes.get("/purchase/:cId", checkAuth, async (req, res) => {
  try {
    const { user } = req.session;
    const { cId } = req.params;

    // Renderizar la vista cart.handlebars con los datos del usuario y del carrito
    res.render("purchase");
  } catch (error) {
    // Manejar errores
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});


viewsRoutes.get("/failregister", (req, res) => {
  res.render("failregister");
});

viewsRoutes.get("/faillogin", (req, res) => {
  res.render("faillogin");
});

viewsRoutes.get("/recoverpass/:rId", (req, res) => {
  res.render("recoverpass");
});

viewsRoutes.get("/manageUsers", applyPolicies(["ADMIN"]), (req, res) => {
  res.render("manageUsers");
});

export default viewsRoutes;
