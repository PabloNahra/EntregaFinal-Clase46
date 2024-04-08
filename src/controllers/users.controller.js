import { usersServicesRep } from "../dao/repositories/index.js";

export const getUsers = async (req, res) => {
  try {
    const resultado = await usersServicesRep.getUsers()
    if(resultado){
      res.send(resultado)
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    res.status(400).json({message: `No podemos devolver los usuarios - ${error}`})
  }
}

export const changeRole = async (req, res) => {
  try {
    const { uId } = req.params
    const resultado = await usersServicesRep.changeRoleRep(uId)
    if(resultado){
      res.send(resultado)
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    res.status(400).json({message: `No se pudo modificar el rol del usuario - ${error}`})
  }
}
