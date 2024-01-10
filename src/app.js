import express from 'express'
import mongoose from 'mongoose'

import productsRoutesFS from './routes/productsFS.routes.js'
import cartsRoutesFS from './routes/cartsFS.routes.js'

import productsRoutes from './routes/products.routes.js'
import cartsRoutes from './routes/carts.routes.js'


const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

mongoose.connect('mongodb+srv://pablonahra:coder123@cluster0.9wbkiz3.mongodb.net/ecommerce')

app.use('/api/productsfs', productsRoutesFS)
app.use('/api/cartsfs', cartsRoutesFS)

app.use('/api/products', productsRoutes)
app.use('/api/carts', cartsRoutes)

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`)
})