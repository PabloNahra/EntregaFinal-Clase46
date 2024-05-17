import UserDTO from "../../dtos/user.dto.js";


export default class UserRepository {
    constructor(dao){
        this.dao = dao
    }

    getUsers = async() => {
        const result = await this.dao.get()
        return result
    }

    getUserByEmailRep = async(email) => {
        const result = await this.dao.getByEmail(email)
        return result
    }
    
    getUserIdByEmailRep = async(email) => {
        const result = await this.dao.getIdByEmail(email)
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

    deleteUsersInac = async() => {
        const result = await this.dao.deleteUsersByDate()
        return result
    }
    
    deleteUserRep = async(uId) => {
        const result = await this.dao.deleteUser(uId)
        return result
    } 

}