import React, { Component } from 'react';
import Navbar from './navbar';
import cookie from 'react-cookies';
import axios from 'axios';

class UserControl extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            nums:0
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange = e =>{
        e.preventDefault();
        const nums = e.target.value
        this.setState({"nums":nums});
    }
    handleSubmit = e => {
        e.preventDefault();
        console.log(this.props);
        if(this.state.nums===0)
            return;
        axios.patch('http://localhost:5000/carts/'+cookie.load('userName'),{
            //"username":cookie.load('userName'),
            "bookID":this.props.id,
            "nums":this.state.nums
            },this.props.config).then(function (response){
            console.log(response.data);
            window.location.href = "/homepage";
            }).catch(function (error){console.log(error);})
    }
    
    render(){
        
        return(
            <div class="d-flex flex-col">
            <form onSubmit = { this.handleSubmit }>
            <label className="mr-2" htmlFor="title">Qty: </label>
                <input className="mr-2" type="number" style={{width: "50px"}} name="Qty" value={this.state.nums} onChange={this.handleChange}  />
                <button type="submit" className="btn btn-primary mr-2">Add to Cart</button>
            </form>
            <a className="btn btn-info" href="/homepage">Cancel</a>
            </div>
        );
    };
}
class AdminControl extends React.Component{
    constructor(props){
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
        
    }
    handleDelete = e => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("inventory",-1);
        axios.patch(
            'http://localhost:5000/books/'+this.props.id,formData,this.props.config)
          .then(function (response){
              console.log(response.data);
              window.location.href = "/homepage";
              
            })
          .catch(function (error){console.log(error);})
        // axios.delete(
        //     'http://localhost:5000/books/'+this.props.id,this.props.config
        //   )
        //   .then(function (response){
        //       console.log(response.data);
        //       window.location.href = "/homepage";
              
        //     })
        //   .catch(function (error){console.log(error);})
    }
    render(){
        return(
            <div class="d-flex flex-col">
            <a className="btn btn-warning mr-2" href={"/books/edit/"+this.props.id}>Edit</a>
            <form onSubmit = { this.handleDelete }>
                <button type="submit" className="btn btn-danger mr-2">Delete</button>
            </form>
            <a className="btn btn-info" href="/homepage">Cancel</a>
            </div>
        );
    };
}


export default class New extends Component{

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
            book:[],
            
        }
    }

    async componentDidMount() {
        console.log("show");
        console.log(this.state);
        
        await axios.get("http://localhost:5000/books/"+this.props.id,this.state.config)
          .then(res => {
            const book = res.data;
            this.setState({ book });
          })
          .catch(function (error){console.log(error);})

          

          if(!this.state.user.userId){
            console.log("not logged in!");
            window.location.href = "/";
        }
        else{
            console.log("logged in");
            //console.log(this.state.user.userId);
        }
    }



    handleChange = e =>{
        e.preventDefault();
        const nums = e.target.value
        this.setState({"nums":nums});
      }
    render(){
        return(
            <div>
            <Navbar history={this.props.history}/>
            <div className="container">
            <h1> Book</h1>
            <div className="card col-md-6 col-sm-10">
            <div className="card-body">
                <h5 className="card-title">{"Title: "+ this.state.book.title}</h5>
                <h5 className="card-subtitle mb-2 text-muted">{"genre: "+ this.state.book.genre}</h5>
                {/* <li >{"image: "+ this.state.book.image}</li> */}
                <h5 className="card-text">
                <img src={'http://localhost:5000/'+this.state.book.image} alt={this.state.book.image} width="200" height="300" />
                </h5>
                
                <h5 className="card-subtitle mb-2 text-muted">{"description: "}</h5><p className="card-text"> {this.state.book.description}</p>
                <h5 className="card-subtitle mb-2 text-muted">{"inventory: "+ this.state.book.inventory}</h5>
                <h5 className="card-subtitle mb-2 text-muted">{"price: $"+ this.state.book.price}</h5>
            </div>
            </div>

            {/* <a className="btn btn-warning" href={"/books/edit/"+this.props.id}>Edit</a> */}
            <div  >
            {this.state.user.username==="Admin" && <AdminControl id={this.state.book._id} config={this.state.config}/>}
            {this.state.user.username!=="Admin" && <UserControl id={this.state.book._id} config={this.state.config}/>}
            
            </div>
            </div>
            </div>
        );
    };
}