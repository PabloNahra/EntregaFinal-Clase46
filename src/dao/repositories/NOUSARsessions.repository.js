import SessionDTO from "../../dtos/session.dto.js";
import passport from "passport";


export default class SessionRepository {
    constructor(dao){
        this.dao = dao
    }
    get = async () => {
        const session = new SessionDTO(req.session.user)
        return session
    }
}
