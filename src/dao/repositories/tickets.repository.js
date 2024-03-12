import TicketDTO from "../../dtos/ticket.dto.js";


export default class TicketRepository {
    constructor(dao){
        this.dao = dao
    }

    getTk = async() => {
        console.log("get Tk Repository")
        const result = await this.dao.get()
        return result
    }

    createTk = async (tk) => {
        console.log("create Tk Repo")
        const newTicket = new TicketDTO(tk)
        const result = await this.dao.addTk(newTicket)
        return result
    }

}