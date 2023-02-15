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
    }
})

const cartSchema = mongoose.Schema({
    user_id:{
        type: Object,
        required: true
    },
    product_id:{
        type: Object,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    }
})

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    categoryId:{
        type: [Object]
    },
    price:{
        type: Number,
        required: true
    },
    image:{
        type: String,
        required: true
    }
})

const orderSchema = mongoose.Schema({
    user_id: {
        type: Object,
        required: true,
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
    },
    date: {
        type: String,
        required: true
    }
})

const invoiceSchema = mongoose.Schema({
    order_id: {
        type: Object,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    product_id: {
        type: Object,
        required: true
    },
    cost: {
        type: Number,
        required: true
    }
})

const userModel = mongoose.model('users', userSchema)
const categoryModel = mongoose.model('category', categorySchema)
const productModel = mongoose.model('product', productSchema)
const orderModel = mongoose.model('order', orderSchema)
const invoiceModel = mongoose.model('invoice', invoiceSchema)
const cartModel = mongoose.model('cart', cartSchema)

module.exports = {
    userModel,
    categoryModel,
    orderModel,
    productModel,
    invoiceModel,
    cartModel
}
