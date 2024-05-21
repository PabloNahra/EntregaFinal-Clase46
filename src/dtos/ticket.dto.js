class TicketDTO {
    constructor(ticket){
        this.purchase_datetime = new Date()
        this.amount = ticket.amount
        this.purcharser = ticket.purcharser,
        this.paymentMethods = ticket.paymentMethods
    }
}

export default TicketDTO