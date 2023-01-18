const express = require('express')
const router = express.Router();
const mongoose = require('../database')
const {userModel, categoryModel} = require('../schemas')


router.get('/getCart/:user_id', async(req, res)=>{
    cartProducts = await userModel.find({_id: req.params.user_id}).select({_id: 0, cart: 1})
    console.log(cartProducts)
    res.json(cartProducts)
})

router.post('/addCart/:user_id', async(req, res)=>{
    for (let product of req.body.products){
        await categoryModel.find({'products._id': product}).then((found)=>{
            userModel.findOneAndUpdate({_id: req.params.user_id}, {$push: {cart: product}}).then(()=>{
                console.log("product added to cart")
            })
        })
        .catch((e)=>{
            console.log("error: in finding cart", e)
        })
    }
    res.json("yes")
})

router.delete('/deleteCart/:user_id', async(req, res)=>{
    await userModel.updateOne({_id: req.params.user_id}, {$pull: {cart: req.body.product}}).then((found)=>{
        console.log("found:", found.modifiedCount)
        if (found.modifiedCount > 0){
            console.log("deleted item from cart");
        }
        else{
            console.log("Product not found in cart")
        }
    })
    .catch((e)=>{
        console.log("error occured while deleting from cart:", e);
    })
    res.json("yes")
})

module.exports = router