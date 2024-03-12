class TicketDTO {
    constructor(ticket){
        this.purchase_datetime = new Date()
        this.amount = ticket.amount
        this.purcharser = ticket.purcharser
    }
}

export default TicketDTO