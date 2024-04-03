import { userModel } from "../../models/user.model.js";


export class SessionManager {
    constructor(path){
        this.path = path
    }

    async recoverPass(email){
        console.log("Es Session Manager Mongo")
        try {
            //Revisar si el mail existe
            const user = await userModel.findOne({email: email})
            if(!user || user === null ){
                return {message: `Usuario NO encontrado`}
            } else {
                //Enviar mail de recuperación
                

            }
        } catch (error) {
            return {message: `No se pudo enviar el email de recuperacion - ${error}`}
        }
    }
}

export default SessionManager