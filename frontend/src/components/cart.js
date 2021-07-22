import React, { Component } from 'react';
import Navbar from './navbar';
import cookie from 'react-cookies';
import axios from 'axios';
import {toast} from 'react-toastify';

export default class BookList extends Component{

    constructor(props){
        super(props);
        this.state = {
            user:{
                userId:cookie.load('userId'),
                username:cookie.load('userName')
            },
            config:{
                headers: {
                  'Authorization': 'Bearer ' + cookie.load('accessToken')
                }
              },
            books:[]
        }
    }

    componentDidMount() {
        if(!this.state.user.userId | !this.state.config){
            console.log("not logged in!");
            window.location.href = "/";
        }
        else{
            console.log("logged in");
            console.log(this.state.user.userId);
        }

        axios.get(
            'http://localhost:5000/carts/'+this.state.user.username,this.state.config)
            .then(res => {
                
                //console.log(res.data);
                const books = res.data;
                this.setState({ books });
                console.log(books);
            })
            .catch(function (error){console.log(error);})
    }

    handleChange = (e) =>{
        e.preventDefault();
        const nums = e.target.value;
        const idx = e.target.name;
        let books = this.state.books;
        books[idx].nums = Math.max(nums,0) 
        this.setState({ books });
        //console.log(books[idx]);
        
        axios.put('http://localhost:5000/carts/'+cookie.load('userName'),
            {bookID:books[idx].book._id,nums:nums},this.state.config,
            ).then(function (response){
              console.log(response.data);
              
            }).catch(function (error){console.log(error);})
    }
    handleClick = (e)=>{
        e.preventDefault();
        
        const idx = e.target.name;
        let books = this.state.books;
        books[idx].nums = 0 
        this.setState({ books });
        //console.log(books[idx]);
        
        axios.put('http://localhost:5000/carts/'+cookie.load('userName'),
            {bookID:books[idx].book._id,nums:0},this.state.config,
            ).then(function (response){
              console.log(response.data);
              
            }).catch(function (error){console.log(error);})
    }
    handleBuy = (e) =>{
        e.preventDefault();
        let books = this.state.books;
        axios.post('http://localhost:5000/carts/deal/'+cookie.load('userName'),{books},this.state.config,
        ).then(res => {
            if(res.data.success){
                toast.success('Buy success!',{autoClose: 2500});
                axios.post('http://localhost:5000/orders/'+this.state.user.username,books,this.state.config).then(res => {}).catch(function (error){console.log(error);})
                this.setState({ books:[] });
            }else
                toast.warn(res.data.messages,{autoClose: 2500});
            console.log(res);
        }).catch(function (error){console.log(error);})

        
    }
    render(){
        let self = this;
        return(
            <div>
            <Navbar history={this.props.history}/>
            
            <div className="container">
            <h1>Shopping Cart</h1>
                {/* <ul> */}
                    {this.state.books.map(function(book,index){
                        if(book.nums>0)
                            
                            return (
                                <div key={index} className="card">
                                    <div className="card-body">
                                        <a nowrap="true"  href={"/books/"+book.book._id}><h5 className="card-title">{book.book.title}</h5></a>
                                        <h6 className="card-subtitle mb-2 text-muted">{book.book.genre}</h6>
                                        
                                        <p className="card-text">{book.book.description}</p>
                                        <div class="d-flex flex-row">
                                            <label className="mr-sm-1"> Price: </label>
                                            <label className="mr-sm-1"> ${book.book.price*self.state.books[index].nums} </label>
                                        </div>
                                        <div class="d-flex flex-row">
                                        <label className="mr-sm-1"> Qty: </label>
                                        <input type='number' style={{width: "50px"}} className="mr-sm-1 mt-sm-100" name={index} value={self.state.books[index].nums} onChange={self.handleChange} />
                                        <button  name={index} className="btn btn-sm btn-danger " onClick={self.handleClick} >Delete</button>
                                        </div>
                                        
                                        
                                        

                                    </div>
                                </div>
                                // <li key={book._id} display="inline">
                                //     <a nowrap="true"  href={"/books/"+book.book._id}>{book.book.title}</a>
                                //     <span > :  <input type='number' name={index} value={self.state.books[index].nums} onChange={self.handleChange}></input></span >
                                //     <button  name={index} onClick={self.handleClick} >Delete</button>
                                // </li>
                            )
                        else
                            return (<div key={book._id} ></div>)
                    })}
                {/* </ul> */}
                
                <form onSubmit = { this.handleBuy }>
                    <button type="submit" className="btn btn-primary">Buy</button>
                </form>
            </div>
            
            </div>
        );
    };
}