class UserDTO {
    constructor(user){
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.role = user.role
        if (Array.isArray(user.documents)) {
            this.documents = user.documents.map(document => {
                return {
                    name: document.name || '',
                    reference: document.reference || ''
                };
            });
        } else {
            this.documents = [];
        }
    }
}

export default UserDTO