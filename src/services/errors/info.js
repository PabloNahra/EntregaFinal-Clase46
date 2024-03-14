// Generar usuarios
export const generateUserErrorInfo = (user) => {
    return `One or more properties are incomplete or invalid
        first_name = needs to be a string, received ${typeof user.first_name}
        last_name = needs to be a string, received ${typeof user.last_name}
        age = needs to be a number, received ${typeof user.age}
        email = needs to be a string, received ${typeof user.email}
    `
}


// Generar productos
export const generateProductErrorInfo = (product) => {
    return `One or more properties are incomplete or invalid
        title = needs to be a string, received ${typeof product.title}
        description = needs to be a string, received ${typeof product.description}
        code = needs to be a string, received ${typeof product.code}
        price = needs to be a number, received ${typeof product.price}
        stock = needs to be a number, received ${typeof product.stock}
        category = needs to be a string, received ${typeof product.category}
        thumbnail = needs to be a array, received ${typeof product.thumbnail}
    `
}