import mongoose from "mongoose";

const cartsCollection = 'carts'

const cartsSchema = mongoose.Schema({
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
    } 
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)