import SessionDTO from "../dtos/session.dto.js";


export const getSession = async (req, res) => {
    try {
      const sessionActual = new SessionDTO(req.session)
      if(sessionActual){
        res.send(sessionActual)
      } else {
        res.status(400).json(sessionActual)
      }
      
    } catch (error) {
      res.status(400).json({message: `No podemos devolver la session actual - ${error}`})
    }
  }

  export const getSessionEmail = async (req, res) => {
    try {
      const sessionActual = new SessionDTO(req.session.user)
      if(sessionActual.email){
        res.send("Usuario actual: " + sessionActual.email)
      } else {
        res.status(400).json(sessionActual.email)
      }
    } catch (error) {
      res.status(400).json({message: `No podemos devolver el EMAIL de la session - ${error}`})
    }
  }



