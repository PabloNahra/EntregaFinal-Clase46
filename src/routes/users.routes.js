import { Router } from "express";
//import { getTickets, postTicket } from "../controllers/tickets.controller.js";
import { changeRole, getUsers, postDoc, deleteUsersInactive, getUserByEmail, deleteUser } from "../controllers/users.controller.js";
import { applyPolicies } from "../middlewares/auth.js";
import { uploader } from "../utils/multer.js"

const usersRoutes = Router()

// Obtener usuarios
usersRoutes.get('/', applyPolicies(['ADMIN']), getUsers)

// Cambiar rol de usuarios con el ID del user de Premium a User y Viceversa
usersRoutes.post('/premium/:uId', applyPolicies(['ADMIN']), changeRole)

//usersRoutes.post('/:uId/documents', uploader.single('file'), postDoc)
usersRoutes.post('/:uId/documents', uploader.array('files'), postDoc)

// Eliminar todos los usuarios que no hayan tenido conexion en los ultimos X dias o 30 minutos en prubea
usersRoutes.delete('/', applyPolicies(['ADMIN']), deleteUsersInactive)

// Obtener usuario por email
usersRoutes.get('/getByEmail/:email', applyPolicies(['ADMIN']), getUserByEmail)

// Eliminar un usuario por id
usersRoutes.delete('/delete/:uId', applyPolicies(['ADMIN']), deleteUser)

// Modificar un usuario puntual
//usersRoutes.put('/manage/:uId', applyPolicies(['ADMIN']), manageUser)

export default usersRoutes