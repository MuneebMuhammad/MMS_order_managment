const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: [String]
    }
})

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    products: {
        type: [{
            name: {type: String},
            price: {type: Number},
            description: {type: String},
            image: {type: String},
            type: {type: String},
        }]
    }
})

const orderSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    product_id: {
        type: [String]
    },
    shipping_address: {
        type: String
    },
    cost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model('users', userSchema)
const categoryModel = mongoose.model('category', categorySchema)
const orderModel = mongoose.model('order', orderSchema)

module.exports = {
    userModel,
    categoryModel,
    orderModel
}
