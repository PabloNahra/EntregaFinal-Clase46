class SessionDTO {
    constructor(session){
        this.first_name = session.first_name
        this.last_name = session.last_name
        this.email = session.email
    }
}

export default SessionDTO