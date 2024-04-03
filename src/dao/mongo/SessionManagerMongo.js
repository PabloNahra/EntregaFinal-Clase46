import { userModel } from "../../models/user.model.js";
import MailingService from "../../services/mailing.js";


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
                //Enviar mail de recuperación
                // Aviso por mail de sesión iniciada
                const mailingService = new MailingService()
                await mailingService.sendSimpleMail({
                    from: 'Coderhouse', 
                    to: email,
                    subject: 'CoderHouse - BackEnd - Recuperar contraseña', 
                    html: `
                        <h1>Coder e-commerce</h1>
                        <h2>Recuperación de contraseña</h2>
                        <p>Haz clic en el siguiente botón para recuperar tu contraseña:</p>
                        <a href="http://localhost:8080/recoverpass" style="display: inline-block; background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 10px;">Recuperar</a>
                    `
                })
                return {message: "Email de recuperación enviado"}
            }
        } catch (error) {
            return {message: `No se pudo enviar el email de recuperacion - ${error}`}
        }
    }
}

export default SessionManager