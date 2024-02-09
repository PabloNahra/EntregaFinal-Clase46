import express from 'express'
import mongoose from 'mongoose'
import productsRoutesFS from './routes/productsFS.routes.js'
import cartsRoutesFS from './routes/cartsFS.routes.js'
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
import { PORT, secret } from './config/consts.js'


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

// configuracion para la conexion 

app.use(session({
    secret: secret,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://pablonahra:coder123@cluster0.9wbkiz3.mongodb.net/ecommerce'
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
mongoose.connect('mongodb+srv://pablonahra:coder123@cluster0.9wbkiz3.mongodb.net/ecommerce')

// File System
app.use('/api/productsfs', productsRoutesFS)
app.use('/api/cartsfs', cartsRoutesFS)

// MongoDB
app.use('/api/products', productsRoutes)
app.use('/api/carts', cartsRoutes)
app.use('/api/chats', chatsRoutes)
app.use('/api/session', sessionRoutes)

app.use('/', viewsRoutes)

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`)
})