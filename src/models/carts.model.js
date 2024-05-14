import mongoose from "mongoose";

const cartsCollection = 'carts'

const cartsSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        required: false,
        ref: 'users', 
        default: null
    },
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    required: true,
                    ref: 'products'
                },
                quantity: Number
            }
        ],
        default: []
    },
    status: {
        type: String,
        require: false,
        default: null
    },
    last_update: {
        type: Date,
        default: Date.now
    } 
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)