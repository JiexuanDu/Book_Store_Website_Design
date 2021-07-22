const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');
const path = require('path');
const uploadMulter = require('./middleware/uploads.js');
const validation = require('./middleware/image_validation.js');
var middleware = require("./middleware");

// get all books
router.get('/', async (req, res) => {
    try{
        const books = await Book.find();
        res.json(books);
    }catch(err){
        res.json({message: err});
    }
});

// get a specific book by id
router.get('/:bookId',middleware.auth, async (req, res) => {
    try{
        const book = await Book.findById(req.params.bookId);
        res.json(book);
    }catch(err){
        res.json({message: err});
    }
});

// add a new book
router.post('/',middleware.auth,uploadMulter,validation, async (req,res) => {
    let data = req.body;
    data.image=req.file.filename;
    const book = new Book(data);

    console.log(req.body);
    console.log(req.file.filename);
    console.log(path.join(__dirname,'../uploads',req.file.filename));
    console.log(book);
    try {
        const savedBook = book.save();
        res.json(savedBook);
    } catch( err ){
        res.json( {message: err} );
    }
});

// update a book
router.patch("/:bookId",middleware.auth,uploadMulter, async (req,res) => {
    if(req.user.username!='Admin')
        res.json([]);
    const data = req.body;
    if(req.file)
        data.image=req.file.filename;
    
    try{
        const updatedBook = await Book.updateOne(
            {_id: req.params.bookId},
            {$set:data}
        );
        res.json(updatedBook);
    }catch(err){
        res.json({message:err});
    }
});

// This project uses soft delete
// delete a book
// CAUTION: HARD DELETE!
// router.delete('/:bookId',middleware.auth, async (req, res) => {
//     if(req.user.username!='Admin')
//         res.json([]);
//     try{
//         const removedBook = await Book.remove({_id: req.params.bookId});
//         res.json(removedBook);
//     }catch(err){
//         res.json( {message: err} );
//     }
// });

// search a book
router.post('/search',middleware.auth, async (req, res) => {
    if(req.body.genre === ''){
        try{
            const books = await Book.find({ "title" : { $regex: req.body.keyword, $options: 'i'}});
            res.json(books);
        }catch(err){
            res.json({message: err});
        }
    }
    else{
        try{
            const books = await Book.find({ "title" : { $regex: req.body.keyword, $options: 'i'},"genre": req.body.genre } );
            res.json(books);
        }catch(err){
            res.json({message: err});
        }
    }
});

// api used to test image upload
// router.post('/uploadimg',uploadMulter,validation,async (req, res) => {
//     res.json({
//         msg:req.file.path
//     })
// })

module.exports = router;