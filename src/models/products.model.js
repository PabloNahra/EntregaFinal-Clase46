import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productsCollection = 'products'

const productsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    } ,
    description:  {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: false
    },
    available: {
        type: Boolean,
        required: true,
        default: 1
    },
    stock: {
        type: Number,
        required: true,
        default: 10000
    },
    category: {
        type: String,
        enum: ['casa','bebe'],
        required: true,
    },
    thumbnail: {
        type: [],
        required: false
    } 
})

productsSchema.plugin(mongoosePaginate)

export const productsModel = mongoose.model(productsCollection, productsSchema)