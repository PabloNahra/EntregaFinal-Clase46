import { Router } from "express";
import { getTickets, postTicket } from "../controllers/tickets.controller.js";
// import { productsModel } from "../models/products.model.js"
// import ProdManager from "../dao/ProductManagerMongo.js";
// import { productsServices2 } from "../dao/repositories/index.js";
import { checkRolAdmin } from "../middlewares/auth.js";

const ticketsRoutes = Router()

ticketsRoutes.get('/', getTickets)

ticketsRoutes.post('/', postTicket)

export default ticketsRoutes