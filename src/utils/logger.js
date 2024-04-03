import winston from 'winston'

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4, 
        debug: 5
    }
    /*
    ,
    colors: {
        fatal: 'red',
        error: 'magenta',
        warn: 'yellow',
        info: 'blue',
        http: 'gray', 
        debug: 'white'
    }
    */
}

const devLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'debug'
        })
        /*,
        new winston.transports.File({
            filename: './errors-dev.log', 
            level: 'http'
        })
        */
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info'
        }),
        new winston.transports.File({
            filename: './errors.log', 
            level: 'error'
        })
    ]
})

export const addLogger = (req, res, next) => {
    switch (process.env.NODE_ENV) {
        case 'development':
            req.logger = devLogger
            req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
            break
        case 'production':
            req.logger = prodLogger
            //req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
            break
        default:
            throw new Error('enviroment doesnt exists')
            break
    }
    next()
}
