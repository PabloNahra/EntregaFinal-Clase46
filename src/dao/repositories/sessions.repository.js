import SessionDTO from "../../dtos/session.dto.js";


export default class SessionRepository {
    constructor(dao){
        this.dao = dao
    }

    recoverPassRep = async(email) => {
        const result = await this.dao.recoverPass(email)
        return result
    }

    recoverNewPassRep = async(rId, newPass) => {
        const result = await this.dao.recoverNewPass(rId, newPass)
        return result
    }
}