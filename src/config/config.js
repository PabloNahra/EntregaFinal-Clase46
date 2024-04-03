import dotenv from 'dotenv'

export const getVariables = (options) => {
    const enviroment = options.opts().mode
    
    dotenv.config({
        path: enviroment === 'production' ? './src/.env.production' : './src/.env.development'
    })

    return {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT, 
        MONGO_URL: process.env.MONGO_URL,
        adminName: process.env.adminName,
        password: process.env.password,
        persistence: process.env.persistence,
        mailing: {
            SERVICE: process.env.MAILING_SERVICE,
            PORT: process.env.MAILING_PORT,
            USER: process.env.MAILING_USER,
            PASSWORD: process.env.MAILING_PASSWORD
        }
    }
}