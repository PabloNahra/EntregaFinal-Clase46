import mongoose from "mongoose";

const userCollection = 'users'

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number        
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    cart: {
        type: mongoose.Schema.ObjectId,
        required: false,
        ref: 'carts'
    },
    recover_id: {
        type: String,
        default: ''
    },
    recover_datetime: {
        type: Date,
        default: null
    }
})

export const userModel = mongoose.model(userCollection, userSchema)