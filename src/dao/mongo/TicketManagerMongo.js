import { ticketsModel } from "../../models/ticket.model.js"


export class TicketManager {
    constructor(path){
        this.path = path;
    }

    async get(){
        try {
            const tickets = await ticketsModel.find()
            return {tickets}
          } catch (error) {
            console.error(error)
            return {message: `No podemos devolver los tickets - ${error}`}
          }
    }

    async addTk(tk){
      try {
          const added = await ticketsModel.create(tk)
          return {message: 'Ticket añadido', ticketId: added._id, status: 201 }
      } catch (error) {
          console.error(error)
          return {message: `No se pudo añadir el ticket - ${error}`}
      }
    }
}


export default TicketManager
