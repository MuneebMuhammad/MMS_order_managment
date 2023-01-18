const express = require('express')
const router = express.Router();
const mongoose = require('../database')
const {userModel, categoryModel, orderModel} = require('../schemas')


router.get('/getOrders', async(req, res)=>{
    
})

router.post('/addOrder', async(req, res)=>{

})

router.delete('/deleteOrder', async(req, res)=>{

})

module.exports = router