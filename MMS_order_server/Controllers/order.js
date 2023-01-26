const express = require('express');
const { escapeSelector } = require('jquery');
const router = express.Router();
const mongoose = require('../database')
const {userModel, categoryModel, orderModel} = require('../schemas')

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

router.get('/getAllProducts', async(req, res)=>{
    products = await categoryModel.find({})
    res.json(products)
})

router.get('/getAllOrders', async(req, res)=>{
    order_formatted = []
    await orderModel.find({}).then((orders)=>{
        orders.map((order)=>{
           order_formatted.push({order_id: order._id, user: order.user_id, 'products': countQuantities(order.product_id), shipping_address: order.shipping_address, cost: order.cost, status: order.status})
           console.log("order formatted: ", order_formatted)
        })
        
    });
    res.json(order_formatted)    
})

router.post('/addOrder', async(req, res)=>{
    // first do payment
    cost = await findCost(req.body.product_id)
    console.log(req.body.user_id, req.body.product_id, req.body.shipping_address, req.body.status, cost)
    newOrder = new orderModel({user_id: req.body.user_id, product_id: req.body.product_id, shipping_address: req.body.shipping_address, cost: cost, status: req.body.status})
    await newOrder.save()
    res.json(true)
})

router.delete('/deleteOrder', async(req, res)=>{
    await orderModel.find({_id: req.body.order_id}).deleteOne().exec()
    res.json("successfully deleted")
})

router.put('/updateOrderAddress', async(req, res)=>{
    await orderModel.findOneAndUpdate({_id: req.body.order_id}, {shipping_address: req.body.shipping_address})
    res.json("Updated address")
})

router.put('/updateOrderStatus', async(req, res)=>{
    current_status = await orderModel.find({_id: req.body.order_id}).select({_id: 0, status: 1})
    new_status = current_status[0].status == "not delivered"? "delivered": "not delivered"
    await orderModel.findOneAndUpdate({_id: req.body.order_id}, {status: new_status})
    res.json(`status updated to ${new_status}`)
})

module.exports = router