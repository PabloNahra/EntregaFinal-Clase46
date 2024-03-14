import express from 'express'
import mongoose from 'mongoose'
import productsRoutes from './routes/products.routes.js'
import cartsRoutes from './routes/carts.routes.js'
import handlebars from 'express-handlebars'
import passport from 'passport'
import viewsRoutes from './routes/views.routes.js'
import chatsRoutes from './routes/chats.routes.js'
import sessionRoutes from './routes/session.routes.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import initializePassport from './config/passport.config.js'
import { Command } from 'commander'
import { secret } from './config/consts.js'
import { getVariables } from './config/config.js'
import ticketsRoutes from './routes/tickets.routes.js'
import { errorHandler } from './middlewares/error.js'


const app = express()

// Entornos
const program = new Command()
program.option('--mode <mode>', 'Modo de trabajo', 'production')
const options = program.parse()
const { PORT, MONGO_URL } = getVariables(options)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

// configuracion para la conexion 
app.use(session({
    secret: secret,
    store: MongoStore.create({
        mongoUrl: MONGO_URL
        // ttl: 15
    }),
    resave: true,
    saveUninitialized: true
}))


// Utilización de passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Configuracion especial por utilizar handlebars con prototipos de mongoose
const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
})

app.engine('handlebars', hbs.engine)
app.set('views', 'src/views')
app.set('view engine', 'handlebars')

// conexion para los endpoints
mongoose.connect(MONGO_URL)

// MongoDB
app.use('/api/products', productsRoutes)
app.use('/api/carts', cartsRoutes)
app.use('/api/chats', chatsRoutes)
app.use('/api/session', sessionRoutes)
app.use('/api/tickets', ticketsRoutes)
app.use('/', viewsRoutes)

// Manejo de errores
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`)
})