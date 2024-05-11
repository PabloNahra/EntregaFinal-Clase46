import { userModel } from "../../models/user.model.js";
import mongoose from "mongoose";
import UsersAllDTO from "../../dtos/usersAll.dto.js";
import UserByEmailDTO from "../../dtos/userByEmail.dto.js";
import MailingService from "../../services/mailing.js";

export class UserManager {
  constructor(path) {
    this.path = path;
  }

  async get() {
    try {
      const users = await userModel.find();
      //const usersAll = new UsersAllDTO(users)
      // Mapear cada usuario a UsersAllDTO
      const usersAll = users.map((user) => new UsersAllDTO(user));
      //console.log(usersAll)
      return { usersAll };
    } catch (error) {
      console.error(error);
      return { message: `No podemos devolver los usuarios - ${error}` };
    }
  }

  async getByEmail(email) {
    try {
      console.log("Dentro de getByEmail")
        const user = await userModel.findOne({ email: email });
        if (user) {
            const userByEmailDTO = new UserByEmailDTO(user);
            console.log("Dentro de getByEmail userByEmailDTO")
            console.log(userByEmailDTO)
            return { userByEmailDTO };
        } else {
            return { message: 'Usuario no encontrado' };
        }
    } catch (error) {
        console.error(error);
        return { message: `No podemos devolver el usuario - ${error}` };
    }
}
  async changeRole(uId) {
    try {
      // Chequear que el userID es un ObjectId
      const isValidObjectId = mongoose.Types.ObjectId.isValid(uId);
      if (!isValidObjectId) {
        return { message: `ID de usuario inválido ${uId}` };
      }
      // Chequear que el userID existe
      const user = await userModel.findOne({ _id: uId });
      if (!user) {
        return { message: "Usuario inexistente" };
      }

      // Si vamos a pasar a un usuario a Premium debe tener cargadas las imagenes: Identificación, Comprobante de domicilio, Comprobante de estado de cuenta
      const requiredValues = ["COMP_DOMICILIO", "COMP_ESTADO_CTA", "IDENTITY"];
      let allValuesPresent = true;

      for (const val of requiredValues) {
        if (
          !user.documents.some((doc) => doc.name.toUpperCase().includes(val))
        ) {
          allValuesPresent = false;
          break;
        }
      }

      // Modificar el Role de User por Premium y viceversa
      const userRole = user.role.toUpperCase();
      const allowedRoles = ["USER", "PREMIUM"];

      // Si lo vamos a pasar de PREMIUM A USER
      if (userRole === "PREMIUM") {
        let newRole = userRole === "USER" ? "PREMIUM" : "USER"; // Cambio de rol
        const updateUserRole = await userModel.updateOne(
          { _id: uId },
          { $set: { role: newRole } }
        );

        if (updateUserRole.modifiedCount > 0) {
          return {
            message: `Rol modificado - User: ${user.email} - Nuevo Rol: ${newRole}`,
            status: 201
          };
        }
      } else if (
        // Si vamos a pasar de USER A PREMIUM
        (user.role.toUpperCase() === "USER") &
        (allValuesPresent === true)
      ) {
        let newRole = userRole === "USER" ? "PREMIUM" : "USER"; // Cambio de rol
        const updateUserRole = await userModel.updateOne(
          { _id: uId },
          { $set: { role: newRole } }
        );

        if (updateUserRole.modifiedCount > 0) {
          return {
            message: `Rol modificado - User: ${user.email} - Nuevo Rol: ${newRole}`,
          };
        }
      } else if (
        // Si vamos a pasar de USER A PREMIUM y no tiene la documentación
        (user.role.toUpperCase() === "USER") &
        (allValuesPresent === false)
      ) {
        console.log("Change Rol NO tiene la doc")
        return { 
          message: "El usuario NO ha procesado toda su documentación", 
          status: 400 };
      } else {
        return { message: "El rol del usuario NO es modificable" };
      }
    } catch (error) {
      console.error(error);
      return { message: `No se pudo modificar el rol - ${error}` };
    }
  }

  async postDocuments(uId, files) {
    try {
      // Chequear que el userID es un ObjectId
      const isValidObjectId = mongoose.Types.ObjectId.isValid(uId);
      if (!isValidObjectId) {
        return { message: `ID de usuario inválido ${uId}` };
      }
      // Chequear que el userID existe
      const user = await userModel.findOne({ _id: uId });
      if (!user) {
        return { message: "Usuario inexistente" };
      }

      // Subir archivos con Multer
      // Recorrer el array de files e imprimir los valores; luego guardarlos en documents de user
      files.forEach((file) => {
        // Verificar si el archivo ya está en la matriz documents del usuario
        const existingDocumentIndex = user.documents.findIndex(
          (doc) => doc.name === file.originalname
        );

        // Si el archivo no está en la matriz documents, lo insertamos
        if (existingDocumentIndex === -1) {
          const fileNameWithoutExtension = file.originalname.slice(
            0,
            file.originalname.lastIndexOf(".")
          );
          user.documents.push({
            name: fileNameWithoutExtension,
            reference: file.path,
          });
        } else {
          // Si el archivo ya existe, actualizamos la referencia
          user.documents[existingDocumentIndex].reference = file.path;
        }
      });

      // Guardar los cambios en el usuario
      await user.save();

      return { message: `Imagenes actualizadas` };
    } catch (error) {
      console.error(error);
      return { message: `No se pudieron subir los archivos - ${error}` };
    }
  }

  async deleteUsersByDate() {
    try {
      const users = await userModel.find();

      // Calcular la fecha actual menos 30 minutos o 2 dias (2880 minutos)
      const cutoffDate = new Date();
      cutoffDate.setMinutes(cutoffDate.getMinutes() - 2880);
      console.log(cutoffDate);

      // Filtrar los usuarios cuya última conexión sea más antigua que cutoffDate
      const usersInactives = users.filter(
        (user) => new Date(user.last_connection) < cutoffDate
      );

      // Obtener solo los _id de los usuarios inactivos
      const usersInactivesData = usersInactives.map((user) => ({
        _id: user._id,
        email: user.email,
      }));

      // Recorrer el array usersInactivesData
      for (const user of usersInactivesData) {
        // Aviso por baja de usuario
        const mailingService = new MailingService();
        await mailingService.sendSimpleMail({
          from: "Coder e-commerce",
          to: user.email,
          subject: "Coder Backend - e-commerce - Baja de usuario",
          html: `
                        <h1>Importante</h1>
                        <h2>Su usuario a sido eliminado de nuestro 
                        e-commerce por inactividad</h2>
                    `,
        });

        // Elimino el usuario
        await userModel.deleteOne({ _id: user._id });
      }

      return { message: `Eliminamos los usuarios inactivos` };
    } catch (error) {
      console.error(error);
      return { message: `No podemos eliminar los usuarios - ${error}` };
    }
  }
}

export default UserManager;
