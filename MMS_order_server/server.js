const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('tiny'))

// Your routes go here
app.get('/getOrders', (req, res) => {
    console.log("hello world")
    res.send('Hello World!');
  });
  
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });










