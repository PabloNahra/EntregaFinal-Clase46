import winston from 'winston'

/*
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({level: 'http'}),
        new winston.transports.File({filename: './errors.log', level: 'http'})
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}
*/


const devLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({level: 'http'}),
        new winston.transports.File({filename: './errors-dev.log', level: 'http'})
    ]
})

const prodLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({level: 'http'}),
        new winston.transports.File({filename: './errors-prod.log', level: 'http'})
    ]
})

export const addLogger = (req, res, next) => {
    switch (process.env.NODE_ENV) {
        case 'development':
            req.logger = devLogger
            req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
            break
        case 'production':
            req.logger = prodLogger
            req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
            break
        default:
            throw new Error('enviroment doesnt exists')
            break
    }
    next()
}
