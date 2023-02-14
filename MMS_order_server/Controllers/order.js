const express = require('express');
const { escapeSelector } = require('jquery');
const router = express.Router();
const mongoose = require('../database')
const {userModel, categoryModel, orderModel, productModel, invoiceModel, cartModel} = require('../schemas')

const ObjectId = require('mongoose').Types.ObjectId;

// converts list of products into dictionary of product keys and quantity value
function countQuantities(products){
    count = {};
    products.forEach((x)=>{
        count[x] = (count[x] || 0) + 1;
    });
    return count;
}

 async function findCost(products){
    console.log("products: ", products)
    cost = 0;
    for (let product of products){
        await categoryModel.find({'products._id': product}).select({'products._id':1, 'products.price':1}).then((p)=>{
            console.log("product object: ", p[0].products)
            p[0].products.forEach((i)=>{
                if (product == i._id){
                    cost += i.price
                }
            })
        })
    }
    return cost
}

router.get('/getAllCategories', async(req, res)=>{
    categories = await categoryModel.find({})
    res.json(categories)
})

// get all products available
router.get('/getAllProducts', async(req, res)=>{
    products = await productModel.find({})
    res.json(products)
})

// get list of all orders of all the users
router.get('/getAllOrders', async(req, res)=>{
    all_orders = await orderModel.find({})
    res.json(all_orders)    
})

// get all invoices of a specific order
router.get('/getOrderInvoices/:order_id', async(req, res)=>{
    all_orders = await invoiceModel.find({order_id: ObjectId(req.params.order_id)})
    res.json(all_orders)
})

// delete a specific invoice
router.delete('/deleteInvoice/:invoice_id', async(req, res)=>{
    console.log(req.params.invoice_id)
    await invoiceModel.find({_id: req.params.invoice_id}).deleteOne().exec()
    res.json("deleted invoice")
})

// add order of a user. Receives user_id, shipping_address, and status
router.post('/addOrder', async(req, res)=>{
    total_cost = 0
    costArr = []
    // productIds = []
    products = await cartModel.find({user_id: ObjectId(req.body.user_id)})
    for (p of products){
        productData = await productModel.find({_id: p.product_id})
        cost = productData[0].price
        total_cost += (cost*p.quantity)
        costArr.push(cost)
    }
    newOrder = new orderModel({user_id: ObjectId(req.body.user_id), shipping_address: req.body.shipping_address, cost: total_cost, status: req.body.status})
    o = await newOrder.save()
    count = 0
    for (p of products){
        invoice = new invoiceModel({order_id: o._id, product_id: p.product_id, quantity: p.quantity, cost: costArr[count]})
        await invoice.save()
        count += 1
    }
    res.json(o)
})

// delete an order and all its invoices
router.delete('/deleteOrder', async(req, res)=>{
    await orderModel.find({_id: req.body.order_id}).deleteOne().exec()
    await invoiceModel.find({order_id: ObjectId(req.body.order_id)}).deleteMany().exec()
    res.json("deleted order")
})

// update the orderAddress of an order
router.put('/updateOrderAddress', async(req, res)=>{
    await orderModel.findOneAndUpdate({_id: req.body.order_id}, {shipping_address: req.body.shipping_address})
    res.json("Updated address")
})

// change the order status of an order
router.put('/updateOrderStatus', async(req, res)=>{
    current_status = await orderModel.find({_id: req.body.order_id}).select({_id: 0, status: 1})
    new_status = current_status[0].status == "not delivered"? "delivered": "not delivered"
    await orderModel.findOneAndUpdate({_id: req.body.order_id}, {status: new_status})
    res.json(`status updated to ${new_status}`)
})

module.exports = router