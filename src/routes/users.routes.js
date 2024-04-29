import { Router } from "express";
//import { getTickets, postTicket } from "../controllers/tickets.controller.js";
import { changeRole, getUsers, postDoc } from "../controllers/users.controller.js";
import { applyPolicies } from "../middlewares/auth.js";
import { uploader } from "../utils/multer.js"

const usersRoutes = Router()

// Obtener usuarios
usersRoutes.get('/', applyPolicies(['ADMIN']), getUsers)

// Cambiar rol de usuarios con el ID del user de Premium a User y Viceversa
usersRoutes.post('/premium/:uId', applyPolicies(['ADMIN']), changeRole)

// Obtener usuarios
//usersRoutes.post('/:uId/documents', uploader.single('file'), postDoc)
usersRoutes.post('/:uId/documents', uploader.array('files'), postDoc)

export default usersRoutes