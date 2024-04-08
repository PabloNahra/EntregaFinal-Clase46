import { userModel } from "../../models/user.model.js"
import mongoose from "mongoose";


export class UserManager {
    constructor(path){
        this.path = path;
    }

    async get(){
        console.log("User Manager Mongo")
        try {
            const users = await userModel.find()
            return {users}
          } catch (error) {
            console.error(error)
            return {message: `No podemos devolver los usuarios - ${error}`}
          }
    }

    async changeRole(uId){
      try {
        // Chequear que el userID es un ObjectId
        const isValidObjectId = mongoose.Types.ObjectId.isValid(uId);
        if (!isValidObjectId) {
          return { message: `ID de usuario inválido ${uId}` };
        }
        // Chequear que el userID existe
        const user = await userModel.findOne({_id: uId})
        if(!user){
          return {message: 'Usuario inexistente'}
        }
        // Modificar el Role de User por Premium y viceversa
        const userRole = user.role.toUpperCase()
        const allowedRoles = ['USER', 'PREMIUM'];
        if(allowedRoles.includes(userRole)){
          console.log(userRole)
          let newRole = (userRole === 'USER') ? 'PREMIUM' : 'USER'; // Cambio de rol
          const updateUserRole = await userModel.updateOne({ _id: uId }, { $set: { role: newRole } });

          if(updateUserRole.modifiedCount > 0){
            return {message: `Rol modificado - User: ${user.email} - Nuevo Rol: ${newRole}`}
          }
        } else {
          return {message: 'El rol del usuario NO es modificable'}
        }
      } catch (error) {
          console.error(error)
          return {message: `No se pudo modificar el rol - ${error}`}
      }
    }
}


export default UserManager
