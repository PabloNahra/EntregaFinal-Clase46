import { Router } from "express";
//import { getTickets, postTicket } from "../controllers/tickets.controller.js";
import { changeRole, getUsers } from "../controllers/users.controller.js";
import { applyPolicies } from "../middlewares/auth.js";

const usersRoutes = Router()

// Obtener usuarios
usersRoutes.get('/', applyPolicies(['ADMIN']), getUsers)

// Cambiar rol de usuarios con el ID del user de Premium a User y Viceversa
usersRoutes.post('/premium/:uId', applyPolicies(['ADMIN']), changeRole)

export default usersRoutes