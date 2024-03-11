import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const ticketsCollection = 'tickets'

const ticketsSchema = mongoose.Schema({
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
        default: 0
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

ticketsSchema.plugin(mongoosePaginate)

export const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema)