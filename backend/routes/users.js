require('dotenv').config()
//const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var middleware = require("./middleware");

// handle user login
router.post('/login', async (req, res) => {
    try{
        console.log("incoming username:"+req.body.username);
        const { password, username } = req.body;
        const user = await User.findOne({username});
        const isValid = await bcrypt.compare(password, user.password);
        //const user = await User.findAndValidate({username, password});
        if(isValid){
            const accessToken = jwt.sign({username}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.json({success: true, message:'Login Success' ,LoginUser: user,accessToken: accessToken});
        }
        else
            res.json({success: false, message: 'non-exist user or wrong password'});    
    }catch(err){
        res.json({success: false, message: 'non-exist user or wrong password'});  
    }
});

// handle user register
router.post('/register', async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        books:{}
    });
    try {
        const checkuser = await User.findOne({username: req.body.username});
        if(!checkuser){
            await user.save();
            res.json({success: true, message: 'register success'});
        }
        else{
            res.json({success: false, message: 'user already exist'});
        }
    } catch( err ){
        res.json( {message: err} );
    }
});

// //increase single cart nums
// router.post('/cart/increase/:username',middleware.auth, async (req, res) => {
//     try{
//         if(req.params.username!==req.user.username)
//             res.json([]);
//         const username = req.params.username;//req.body.username
//         const user = await User.findOne({username: username});
//         var books = user.get("books");
//         //console.log(books);
//         var obj = {}
//         for (const [key, value] of books.entries()) {//copy the old cart
//             //console.log(key, value);
//             if(value)
//                 obj[key]=value;
//         }
//         //update the new one
//         if(obj[req.body.bookId])
//             obj[req.body.bookId] = parseInt(obj[req.body.bookId])+parseInt(req.body.bookNum);
//         else
//             obj[req.body.bookId] = parseInt(req.body.bookNum);
//         console.log(obj);
//         const updatedUser = await User.updateOne(
//             {username: username},
//             {$set:{"books":obj}}
//             //{$set:{"books":{"001":3}}}
//             //{$push:{"books":"0"}}//only for array
//         );
//         res.json(updatedUser);
//     }catch(err){
//         res.json(err.message);
//     }
// });
// //update whole cart
// router.put('/cart/:username',middleware.auth, async (req, res) => {
//     try{
//         if(req.params.username!==req.user.username)
//             res.json([]);
//         const username = req.params.username;//req.body.username
//         //const user = await User.findOne({username: username});
//         //var books = user.get("books");
//         console.log(req.body.books);
//         let books = req.body.books;
//         var obj = {}
//         books.map(book=>{
//             if(book.nums>0)
//                 obj[book._id]=parseInt(book.nums);})
//         const updatedUser = await User.updateOne(
//             {username: username},
//             {$set:{"books":obj}}
//             //{$set:{"books":{"001":3}}}
//             //{$push:{"books":"0"}}//only for array
//         );
//         res.json(updatedUser);
//     }catch(err){
//         res.json(err.message);
//     }
// });

// router.get('/cart/:username',middleware.auth, async (req, res) => {
//     try{
//         if(req.params.username!==req.user.username)
//             res.json([]);
//         const Book = require('../models/book.model');
//         const user = await User.findOne({username: req.user.username});
//         //const user = await User.findOne({username: req.params.username});
//         var books = user.get("books");
//         //id to book
//         var arr = []
    
//     for (const [key, value] of books.entries()) {//copy the old cart
//             //console.log(key, value);
            
//             var book = await Book.findOne({_id: key});
//             book = JSON.parse(JSON.stringify(book))
//             book["nums"] = value;
//             console.log(book)
//             arr.push(book);
//         }
//         res.json(arr);
//     }catch(err){
//         res.json([]);
//         //res.json({message: err.message});
//     }
// });

// router.delete('/cart/:username',middleware.auth, async (req, res) => {
//     try {
//         if(req.params.username!==req.user.username)
//             res.json([]);
//         const updatedUser = await User.updateOne(
//             {username: req.user.username},
//             {$set:{"books":{}}}
//             //{$set:{"books":{"001":3}}}
//             //{$push:{"books":"0"}}//only for array
//         );
//         res.json(updatedUser);
//     } catch (error) {
//         res.json({message: err.message});
//     }
    
// });
module.exports = router;