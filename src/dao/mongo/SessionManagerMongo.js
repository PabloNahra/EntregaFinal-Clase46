import { userModel } from "../../models/user.model.js";
import MailingService from "../../services/mailing.js";
import crypto from 'crypto'; // Importar el módulo crypto para la generación del ID aleatorio
import { createHash } from "../../utils/bcrypt.js";

export class SessionManager {
    constructor(path){
        this.path = path
    }

    async recoverPass(email){
        try {
            //Revisar si el mail existe
            const user = await userModel.findOne({email: email})
            console.log("user")
            console.log(user)
            if(!user || user == null ){
                return {message: `Usuario NO encontrado`}
            } else {
                // Generar id 
                const idLength = 20; // Longitud del ID
                const randomBytes = crypto.randomBytes(Math.ceil(idLength / 2));
                const id = randomBytes.toString('hex').slice(0, idLength);

                console.log("id")
                console.log(id)

                // Guardar el ID y fecha en el user
                user.recover_id = id
                user.recover_datetime = new Date()
                user.save()
                
                //Enviar mail de recuperación
                const mailingService = new MailingService()
                await mailingService.sendSimpleMail({
                    from: 'Coderhouse', 
                    to: email,
                    subject: 'CoderHouse - BackEnd - Recuperar contraseña', 
                    html: `
                        <h1>Coder e-commerce</h1>
                        <h2>Recuperación de contraseña</h2>
                        <p>Haz clic en el siguiente botón para recuperar tu contraseña:</p>
                        <a href="http://localhost:8080/recoverpass/${id}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 10px;">Recuperar</a>
                    `
                })
                return {message: "Email de recuperación enviado"}
            }
        } catch (error) {
            return {message: `No se pudo enviar el email de recuperacion - ${error}`}
        }
    }

    async recoverNewPass(rId, newPass){
        try {
            console.log("en Sesion Manager rId")
            console.log(rId)
            // Chequear que el rId exista para un usuario y tomar sus datos
            const user = await userModel.findOne({recover_id: rId})
            if(!user || user == null ){
                return {message: `Link de recuperación incorrecto`}
            } 
            
            // Validar que nueva PassWord no sea igual a la anterior; sino retornar aviso 
            /*
            console.log(user.password)
            console.log(newPass)
            console.log(newPassHash)
            */
            const newPassHash = createHash(newPass)
            if (user.password != newPassHash){
                // Modificar la clave
                console.log("Clave nueva distinta")
                user.password = newPassHash
                user.save()
                return {message: 'Password changed'}
            } else {
                return {message: `La nueva clave es igual a la anterior. Debe optar por otra.`}
            }
        } catch (error) {
            return {message: `No se pudo modificar el password - ${error}`}
        }

    }
}

export default SessionManager