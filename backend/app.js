const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const path = require('path');

app.use(express.static('uploads'));

//Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
// import Routes
const booksRoute = require('./routes/books');
const usersRoute = require('./routes/users');
const ordersRoute = require('./routes/orders');
const cartsRoute = require('./routes/carts');

app.use('/books', booksRoute);
app.use('/users', usersRoute);
app.use('/orders', ordersRoute);
app.use('/carts', cartsRoute);

// index route
app.get('/', (req, res) => {
    //res.cookie('test','test')
    res.send('we are in root index');
    
});

// connect to database
mongoose.connect(
    //'mongodb://localhost:27017/bookstore',
    'mongodb+srv://UTDCS6314:utdallas@cluster0.jtmhc.mongodb.net/<dbname>?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true},
    function(err){
        if(err){
            console.log('connection failed');
        }
        else{
            console.log('database connected');
        }
    }
);

// listen to server
app.listen(5000);
