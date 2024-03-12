import { Router } from "express";
import { getTickets, postTicket } from "../controllers/tickets.controller.js";

const ticketsRoutes = Router()

ticketsRoutes.get('/', getTickets)

ticketsRoutes.post('/', postTicket)

export default ticketsRoutes