import { ticketsServicesRep } from "../dao/repositories/index.js";


export const getTickets = async (req, res) => {
  try {
    //const resultado = await cartsServicesRep.getCartsRep()
    const resultado = await ticketsServicesRep.getTk()
    if(resultado){
      res.send(resultado)
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    res.status(400).json({message: `No podemos devolver los carritos - ${error}`})
  }
}

export const postTicket = async (req, res) => {
  try {
    const newTicket = req.body
    const resultado = await ticketsServicesRep.createTk(newTicket)
    if(resultado){
      res.send(resultado)
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    res.status(400).json({message: `No se pudo añadir el ticket - ${error}`})
  }
}
