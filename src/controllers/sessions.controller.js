import SessionDTO from "../dtos/session.dto.js";
import { sessionsServicesRep } from "../dao/repositories/index.js";

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

export const userRecoverPassByMail = async (req, res) => {
  const {email} = req.body
  try {
    const resultado = await sessionsServicesRep.recoverPassRep(email)
    if(resultado){
      res.send({resultado})
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No podemos restaurar la contraseña: ${error}`})
  }
}

export const userRecoverNewPass = async (req, res) => {
  // ID de la recuperación de contraseña
  const { rId } = req.params
  const { newPass } = req.body
  try {
    const resultado = await sessionsServicesRep.recoverNewPassRep(rId, newPass)
    if(resultado){
      res.send({resultado})
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    console.error(error)
    res.status(400).json({message: `No podemos restaurar la contraseña: ${error}`})
  }
}

