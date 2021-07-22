import React, { Component } from 'react';
import Navbar from './navbar';
import cookie from 'react-cookies';
import axios from 'axios';

export default class Edit extends Component{

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
            imageURL:'',
            

        }
    }

    componentDidMount() {
        //console.log("show");
        //console.log(this.props.id);
        if(!this.state.user.userId){
            console.log("not logged in!");
            window.location.href = "/";
        }
        else{
            console.log("logged in");
            //console.log(this.state.user.userId);
        }
        axios.get(
            "http://localhost:5000/books/"+this.props.id,this.state.config
          )
          .then(res => {
            let book = res.data;
            this.setState({ book });
            this.setState({imageURL:'http://localhost:5000/'+book.image})
          })
          .catch(function (error){console.log(error);})

          


    }

    handleSubmit = e => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("BookImage",this.state.book.image);
        formData.append("title",this.state.book.title);
        formData.append("genre",this.state.book.genre);
        formData.append("inventory",this.state.book.inventory);
        formData.append("price",this.state.book.price);
        formData.append("description",this.state.book.description);
 
        //console.log(book);
        axios.patch(
            'http://localhost:5000/books/'+this.props.id,formData,this.state.config)
          .then(function (response){
              console.log(response.data);
              window.location.href = "/homepage";
              
            })
          .catch(function (error){console.log(error);})
    
    }
    handleChange = e =>{
        e.preventDefault();
        console.log(e.target.value);
        const target = e.target;
        const name = target.name;
        var book = this.state.book;
        book[name] = e.target.value;
        this.setState(book);
    }
    handleImage = e =>{
        e.preventDefault();
        var book = this.state.book;
        book.image = e.target.files[0]
        console.log(book);
        this.setState(book);
        this.setState({imageURL:URL.createObjectURL(e.target.files[0])});
        
    }
    render(){
        
        return(
            <div>
            <Navbar history={this.props.history}/>
            <div className="container">
            <h1> Edit</h1>

            {/* <ul>
                <li >{"Title: "+ this.state.book.title}</li>
                <li >{"genre: "+ this.state.book.genre}</li>
                <li >{"image: "+ this.state.book.image}</li>
                <li >{"description: "+ this.state.book.description}</li>
                <li >{"price: "+ this.state.book.price}</li>
            </ul> */}
            <form onSubmit = { this.handleSubmit }>
                <label htmlFor="title">title: </label>
                <input style={{marginLeft:"20px"}} type="text" name="title" onChange={this.handleChange} value={this.state.book.title} ></input><br></br>
                <div style={{display:"table-cell"}}>
                    <label style={{display:"inline-block"}} htmlFor="genre">genre: </label>
                    <select style={{width:"120px",display:"inline-block"}} className="form-control select_margin" name="genre" type="text" value={this.state.book.genre} onChange={this.handleChange}>
                        <option value="education">education</option>
                        <option value="art">art</option>
                        <option value="science">science</option>
                        <option value="literature">literature</option>
                        <option value="novel">novel</option>
                    </select>
                </div>
                <label htmlFor="image">image: {this.state.imageURL}</label><br></br>
                <input type="file" name="image" onChange={this.handleImage}  ></input><br></br>
                <img src={this.state.imageURL} alt={this.state.imageURL} width="200" height="300" />
                
                <br></br>
                <label htmlFor="inventory">inventory: </label>
                <input  style={{marginLeft:"20px"}}type="number" name="inventory" onChange={this.handleChange} value={this.state.book.inventory} ></input><br></br>
                <label htmlFor="price">price: </label>
                <input style={{marginLeft:"52px"}} type="number" name="price" onChange={this.handleChange} value={this.state.book.price} ></input><br></br>
                <div style={{height:"70px"}}>
                    <label style={{verticalAlign:"middle",height:"70px"}} htmlFor="description">description: </label>
                    <textarea style={{marginLeft:"7.6px",width:"30%"}} name="description" onChange={this.handleChange} value={this.state.book.description} ></textarea><br></br>
                </div>
                
                <button style={{width:"75px"}} type="submit"  className="btn btn-info">Save</button>
            </form>
            

            <a className="btn btn-outline-danger" href="/homepage">Cancel</a>
            </div>
            </div>
        );
    };
}
