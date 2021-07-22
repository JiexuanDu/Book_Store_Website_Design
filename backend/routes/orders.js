const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const Book = require('../models/book.model');
var middleware = require("./middleware");

// get all orders
router.get('/',middleware.auth, async (req, res) => {
    if(req.user.username!='Admin')
        res.json([]);
    Order.find().populate('book').exec((err, doc) => {
        if (err) { return console.error(err); }
        let map = {}
        const obj = JSON.parse(JSON.stringify(doc))
        for(i in obj){
            if(map[obj[i].date])
                map[obj[i].date].push(obj[i])
            else
                map[obj[i].date]=[obj[i]]
        }
        let arr=[]
        for(i in map){
            arr.push(map[i])
        }
        console.log(arr);
        res.json(arr);
    })
});

router.get('/:username',middleware.auth, async (req,res) => {
    const filter = {username:req.params.username}

    Order.find(filter).populate('book').exec((err, doc) => {
        if (err) { return console.error(err); }
        let map = {}
        const obj = JSON.parse(JSON.stringify(doc))
        for(i in obj){
            if(map[obj[i].date])
                map[obj[i].date].push(obj[i])
            else
                map[obj[i].date]=[obj[i]]
        }
        let arr=[]
        for(i in map){
            arr.push(map[i])
        }
        console.log(arr);
        res.json(arr);
    })
});

router.post('/:username',middleware.auth, async (req,res) => {
    let currentTime = new Date();
    books = req.body;
    
    
    try {
        for(i in books){
            if(books[i].nums!=0){
                const book = {username:req.params.username,
                    nums:books[i].nums,
                    book:books[i].book._id,
                    date:currentTime
                }
                console.log(book);
                const order = new Order(book);
                order.save();
            }
        }
        res.json({});
    } catch( err ){
        res.json( {message: err} );
    }
});


module.exports = router;