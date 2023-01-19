const express = require('express')
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

router.get('/getAllOrders', async(req, res)=>{
    order_formatted = []
    await orderModel.find({}).then((orders)=>{
        orders.map((order)=>{
           order_formatted.push({user: order.user_id, 'products': countQuantities(order.product_id), shipping_address: order.shipping_address, cost: order.cost, status: order.status})
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

})

router.put('/updateOrderAddress', async(req, res)=>{

})

router.put('/updateOrderStatus', async(req, res)=>{

})

module.exports = router