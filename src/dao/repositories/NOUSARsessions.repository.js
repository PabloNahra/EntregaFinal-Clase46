import SessionDTO from "../../dtos/session.dto.js";
import passport from "passport";


export default class SessionRepository {
    constructor(dao){
        this.dao = dao
    }
/*
    get = async() => {
        console.log("get Session Repository")
        const result = await this.dao.get()
        return result
    }
*/
    get = async () => {
        console.log("Session actual")
        const session = new SessionDTO(req.session.user)
        console.log("session")
        console.log(session)
        return session
    }
}
