import mongoose from "mongoose";

const cartsCollection = 'carts'

/*
const productSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    }
});
*/

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