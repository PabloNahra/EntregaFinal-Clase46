import mongoose from "mongoose"
import ProdManager from '../dao/mongo/ProductManagerMongo.js'
import Assert from 'assert'

const asert = Assert.strict

mongoose.connect('mongodb+srv://pablonahra:coder123@cluster0.9wbkiz3.mongodb.net/backend')

describe('Testing de ProductDao', () => {
    before(function(){
        this.productDao = new ProdManager()
    })

    beforeEach(function(){
        this.timeout(5000)
    })

    it('El get debe devolver un arreglo', async function(){
        const result = await this.productDao.get()
    })
})