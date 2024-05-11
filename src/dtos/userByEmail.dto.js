class UserByEmailDTO {
    constructor(user) {
        this.email = user.email;
        this.role = user.role;
        this.user_id = user._id.toString(); // Convertir ObjectId a string
    }
}

export default UserByEmailDTO;
