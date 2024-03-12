import TicketDTO from "../../dtos/ticket.dto.js";


export default class TicketRepository {
    constructor(dao){
        this.dao = dao
    }

    getTk = async() => {
        const result = await this.dao.get()
        return result
    }

    createTk = async (tk) => {
        const newTicket = new TicketDTO(tk)
        const result = await this.dao.addTk(newTicket)
        return result
    }
}