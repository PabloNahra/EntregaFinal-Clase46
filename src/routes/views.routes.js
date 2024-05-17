import { Router } from "express";
import ProdManager from "../dao/mongo/ProductManagerMongo.js";
import {
  checkAuth,
  checkExistingUser,
  applyPolicies,
} from "../middlewares/auth.js";
import CartManager from "../dao/mongo/CarritoManagerMongo.js";


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

viewsRoutes.get("/cart", checkAuth, async (req, res) => {
  try {
    const { page } = req.query;
    const { user } = req.session;
    let ultCart;

    console.log("Dentro del get en view.routes")
    const uEmail = user.email
    console.log(uEmail)
    const userCarts = await cartManager.getCartByUserEmail(uEmail)
    console.log(userCarts)

    if (userCarts.message === 'OK') {
      const carritos = userCarts.rdo
      console.log("carritos")
      console.log(carritos)
      // Filtrar carritos por estado y ordenar por last_connection
      const filteredCarts = carritos.filter((cart) => {
        const status = cart.status ? cart.status.toUpperCase() : null;
        return status !== "FINALIZADO" && status !== "CANCELADO";
      });
      filteredCarts.sort(
        (a, b) => new Date(b.last_connection) - new Date(a.last_connection)
      );

      // Tomar el carrito más reciente si hay alguno después de filtrar y ordenar
      if (filteredCarts.length > 0) {
        ultCart = filteredCarts[0];
      } else {
        ultCart = null; // Si no hay carritos después de filtrar y ordenar
      }
    }

    console.log("ultCart");
    console.log(ultCart);
    const cart = ultCart

    //res.render('cart', { user, products });
    res.render("cart", { user, cart });
  } catch (error) {
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
