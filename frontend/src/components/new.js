import React, { Component } from 'react';
import Navbar from './navbar';
import cookie from 'react-cookies';
import axios from 'axios';

export default class New extends Component{

    constructor(props){
        super(props);
        this.state = {
            user:{
                userId:cookie.load('userId'),
                username:cookie.load('userName')
            },
            book:[],
            config:{
                headers: {
                  'Authorization': 'Bearer ' + cookie.load('accessToken')
                }
              },
            imageURL:''
        }
    }

    componentDidMount() {
        console.log("new");
        if(!this.state.user.userId){
            console.log("not logged in!");
            window.location.href = "/";
        }
        else{
            console.log("logged in");
            console.log(this.state.user.userId);
        }
        let book = this.state.book;
        book.genre='education';
        this.setState(book);
    }
    handleSubmit = e => {
        e.preventDefault();
        
        console.log(this.state.book);
        let formData = new FormData();
        formData.append("BookImage",this.state.book.image);
        formData.append("title",this.state.book.title);
        formData.append("genre",this.state.book.genre);
        formData.append("inventory",this.state.book.inventory);
        formData.append("price",this.state.book.price);
        formData.append("description",this.state.book.description);
          //console.log(json);
        axios.post(
            'http://localhost:5000/books/',
            // "title": this.state.book.title,
            // "genre":this.state.book.genre,
            // "BookImage":this.state.book.image,
            // "price":this.state.book.price,
            // "description":this.state.book.description,
            formData,this.state.config
            )
          .then(function (response){
              console.log(response.data.message);
              window.location.href = "/homepage";
            })
          .catch(function (error){console.log(error);})
    
    }
    // handleChange(event) {
    //     this.setState({
    //       [event.target.name]: event.target.value
    //     });
    //   }

      handleChange = e =>{
        e.preventDefault();
        const target = e.target;
        const name = target.name;
        var book = this.state.book;
        book[name] = e.target.value;
        console.log(book);
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
            <h1> New Book</h1>

            
            <form onSubmit = { this.handleSubmit }>
                <label htmlFor="title">title: </label>
                <input style={{marginLeft:"20px"}} type="text" name="title" onChange={this.handleChange} ></input><br></br>
                <div style={{display:"table-cell"}}>
                    <label style={{display:"inline-block"}} htmlFor="genre">genre: </label>
                    <select style={{width:"120px",display:"inline-block"}} className="form-control select_margin" name="genre" type="text" onChange={this.handleChange}>
                        <option value="education">education</option>
                        <option value="art">art</option>
                        <option value="science">science</option>
                        <option value="literature">literature</option>
                        <option value="novel">novel</option>
                    </select>
                </div>
                <label htmlFor="image">image: </label>
                <input type="file" name="image" onChange={this.handleImage} ></input><br></br>
                <img src={this.state.imageURL} alt={this.state.imageURL} width="200" height="300" /><br></br>
                <label htmlFor="inventory">inventory: </label>
                <input style={{marginLeft:"20px"}} type="text" name="inventory" onChange={this.handleChange} ></input><br></br>
                <label htmlFor="price">price: </label>
                <input style={{marginLeft:"52px"}} type="text" name="price" onChange={this.handleChange} ></input><br></br>
                <div style={{height:"70px"}}>
                    <label style={{verticalAlign:"middle",height:"70px"}} htmlFor="description">description: </label>
                    <textarea style={{marginLeft:"7.6px",width:"30%"}}  name="description" onChange={this.handleChange} ></textarea><br></br>
                </div>
                
                <button style={{width:"75px"}} type="submit"  className="btn btn-info">Save</button>
            </form>

            <a className="btn btn-outline-danger" href="/homepage">Cancel</a>
            </div>
            </div>
        );
    };
}