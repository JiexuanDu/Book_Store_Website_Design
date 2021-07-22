const Cart = require('../models/cart.model');
const Book = require('../models/book.model');
const express = require('express');
const { json } = require('body-parser');
const router = express.Router();
var middleware = require("./middleware");

//update
router.put('/:username',middleware.auth, async (req,res) => {
    const filter = {username: req.params.username,book:req.body.bookID}
    const foundCart = await Cart.find(filter)
    // console.log(foundCart.length);
    // console.log(JSON.stringify(foundCart[0]));

    try {
        if(foundCart.length==1){
            let nums = Math.max(parseInt(req.body.nums),0);
            const updatedCart = await Cart.updateOne(
                filter,
                {nums}
            );
            res.json(updatedCart)
        }else{
            if(foundCart.length>1)
                await Cart.remove(filter);
            
            const cart = new Cart({
                username: req.params.username,
                nums: parseInt(req.body.nums),
                book:req.body.bookID
            });
            const savedCart=cart.save();
            res.json(savedCart)
        }
    } catch( err ){
        res.json( {message: err} );
    }
});
//increse
router.patch('/:username',middleware.auth, async (req,res) => {
    const filter = {username: req.params.username,book:req.body.bookID}
    const foundCart = await Cart.find(filter)
    // console.log(foundCart.length);
    // console.log(JSON.stringify(foundCart[0]));
    try {
        if(foundCart.length==1){
            const obj = JSON.parse(JSON.stringify(foundCart[0]))
            let nums = Math.max(parseInt(req.body.nums)+parseInt(obj['nums']),0);
            
            const updatedCart = await Cart.updateOne(
                filter,
                {nums}
            );
            res.json(updatedCart)
        }else{
            if(foundCart.length>1)
                await Cart.remove(filter);

            const cart = new Cart({
                username: req.params.username,
                nums: parseInt(req.body.nums),
                book:req.body.bookID
            });
            const savedCart=cart.save();
            res.json(savedCart)
        }
    } catch( err ){
        res.json( {message: err} );
    }
});

router.get('/',middleware.auth, async (req,res) => {
    Cart.find().populate('book').exec((err, doc) => {
        if (err) { return console.error(err); }
        res.json(doc);
    })
});

router.get('/:username',middleware.auth, async (req,res) => {
    const filter = {username:req.params.username}
    
    Cart.find(filter).populate('book').exec((err, doc) => {
        if (err) { return console.error(err); }
        res.json(doc);
    })
});

router.post('/deal/:username',middleware.auth, async (req,res) => {
    const filter = {username:req.params.username}
    
    Cart.find(filter).populate('book').exec(async (err, doc) => {
        if (err) { return console.error(err); }
        const obj = JSON.parse(JSON.stringify(doc));
        for(i in obj){
            //console.log(obj[i]);
            if(obj[i].nums==0) continue;
            if(obj[i].nums>obj[i].book.inventory){
                res.json( {success:false,messages:obj[i].book.title+' out of stock'});
                return console.error(obj[i].book.title+' out of stock');
            }
        }
        Cart.updateMany(filter,{$set:{ nums: 0 }}).then(orders => {
            console.info(orders);
        }).catch(err => next(err));
        
        for(i in obj){
            if(obj[i].nums!=0)
            await Book.updateOne(
                {_id:obj[i].book},
                {inventory:obj[i].book.inventory-obj[i].nums}
            );
        }
        
        res.json({obj,success:true});
    })
});

module.exports = router;