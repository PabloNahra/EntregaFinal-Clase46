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
    console.log("Dentro del changeRole: resultado")
    console.log(resultado)
    if(resultado.status === 200 || resultado.status === 201){
      res.status(201).send(resultado)
    } else {
      res.status(403).json(resultado)
    }
  } catch (error) {
    res.status(400).json({message: `No se pudo modificar el rol del usuario - ${error}`})
  }
}

export const postDoc = async (req, res) => {
  try {
    const { uId} = req.params
    const files = req.files
    const resultado = await usersServicesRep.postDocum(uId, files)
    if(resultado){
      res.send(resultado)
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    res.status(400).json({message: `No podemos subir los archivos - ${error}`})
  }
}

export const deleteUsersInactive = async (req, res) => {
  try {
    const resultado = await usersServicesRep.deleteUsersInac()
    if(resultado){
      res.send(resultado)
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    res.status(400).json({message: `No podemos eliminar los usuarios inactivos - ${error}`})
  }
}


export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params
    const resultado = await usersServicesRep.getUserByEmailRep(email)
    if(resultado){
      res.send(resultado)
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    res.status(400).json({message: `No podemos devolver los usuarios - ${error}`})
  }
}

/*
export const manageUser = async (req, res) => {
  try {
    const { uId } = req.params
    const resultado = await usersServicesRep.manageUserRep(uId)
    if(resultado){
      res.send(resultado)
    } else {
      res.status(400).json(resultado)
    }
  } catch (error) {
    res.status(400).json({message: `No se pudo modificar los datos del usuario - ${error}`})
  }
}
*/