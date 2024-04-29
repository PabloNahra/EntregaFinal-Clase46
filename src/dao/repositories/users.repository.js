import UserDTO from "../../dtos/user.dto.js";


export default class UserRepository {
    constructor(dao){
        this.dao = dao
    }

    getUsers = async() => {
        const result = await this.dao.get()
        return result
    }
    
    changeRoleRep = async(uId) => {
        const result = await this.dao.changeRole(uId)
        return result
    }

    postDocum =  async(uId, files) => {
        const result = await this.dao.postDocuments(uId, files)
        return result
    }
    
}