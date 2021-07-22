import React, { Component } from 'react';
import Navbar from './navbar';
import cookie from 'react-cookies';
import axios from 'axios';

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
            orders:[]
        }
    }

    componentDidMount() {
        if(!this.state.user.userId){
            console.log("not logged in!");
            window.location.href = "/homepage";
        }
        else{
            console.log("logged in");
            console.log(this.state.user.userId);
        }

        if(this.state.user.username==="Admin"){
            axios.get(
                'http://localhost:5000/orders/',this.state.config).then(res => {
                    
                    console.log(res.data);
                    const orders = res.data;
                    this.setState({ orders });
                    console.log(orders);
                })
                .catch(function (error){console.log(error);})
        }
        else{
            axios.get(
                'http://localhost:5000/orders/'+this.state.user.username,this.state.config).then(res => {
                    
                    console.log(res.data);
                    const orders = res.data;
                    this.setState({ orders });
                    console.log(orders);
                })
                .catch(function (error){console.log(error);})
        }

    }


    render(){
        let orders = this.state.orders
        console.log( orders);
        
        // for (let [key, value] of this.state.orders) {
        //     console.log(key + ' = ' + value)
        // }
        return(
            <div>
            <Navbar history={this.props.history}/>
            <div className="container">
            <h1>Order History of  <span className="font-weight-bolder text-muted">{this.state.user.username}</span></h1>
                <ul>
                 {orders.map(function(order,idx){
                     return (
                        <div key={idx}>
                        <h5 className="card-title">{order[0].date.substring(0, 10)+'  ('+order[0].date.substring(11, 19)+')'}</h5>
                        <div key={idx} className="card">
                        <div className="card-body">
                        
                        {
                                order.map(function (book,idx){
                                    return(
                                    // <li key={idx+'_1'}>{book.book.title+' : '+book.nums}</li>
                                    <div>
                                    <h6 className="card-subtitle mb-2 text-muted">{book.book.title+' : '+book.nums}</h6>
                                    <h6 className="card-subtitle mb-2 text-muted">Total Price:${book.book.price*book.nums}</h6>
                                    </div>
                                    )})
                        }
                        <h6 className="card-subtitle mb-2 text-muted">{'Ship to : '+order[0].username}</h6>
                        {/* <p className="card-text">{video.description}</p> */}
                        </div>
                        </div>
                        </div>
                     )
                 })}
                </ul>
                

            </div>
            
            </div>
        );
    };
}