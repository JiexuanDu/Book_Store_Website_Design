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
            books: [],
            keyword:"",
            genre_filter:"",
        }
    }

    componentDidMount() {
        if(!this.state.user.userId){
            console.log("not logged in!");
            window.location.href = "/";
        }
        else{
            console.log("logged in");
            console.log(this.state.user.userId);
        }
        console.log("home");
        axios.get(
            'http://localhost:5000/books',
            )
            .then(res => {
                console.log(res.data);
                const books = res.data;
                this.setState({ books });
            })
            .catch(function (error){console.log(error);})
        
        

    }

    handleKeywordChange = e =>{
        e.preventDefault();
        this.setState({
            keyword: e.target.value
        });
    }

    handleGenreChange = e =>{
        e.preventDefault();
        this.setState({
            genre_filter: e.target.value
        });
    }

    handleSearch = e =>{
        e.preventDefault();

        const keyword = this.state.keyword;
        const genre = this.state.genre_filter;
        axios.post(
            'http://localhost:5000/books/search',
            {
              "keyword": keyword,
              "genre": genre,
            },
            this.state.config
          )
        .then(res => {
            console.log(res.data);
            const books = res.data;
            this.setState({ books });
            })
        .catch(function (error){console.log(error);})

        console.log(this.state.books);
    }


    subComponent() {
        return (<div>Hello World</div>);
      }
    render(){
        return(
            <div>
            <Navbar history={this.props.history}/>
            <div className="centered">
                <form className="form-inline my-2 my-lg-0" onSubmit={this.handleSearch} >
                Keyword: 
                <input type="text" className="form-control mr-sm-2 input_margin" name="keyword" placeholder="Title" aria-label="Search" onChange={this.handleKeywordChange}/>
                Genre: 
			        <select className="form-control select_margin" name="genre" type="text" onChange={this.handleGenreChange}>
				        <option value="">All</option>
				        <option value="education">education</option>
				        <option value="art">art</option>
				        <option value="science">science</option>
                        <option value="literature">literature</option>
                        <option value="novel">novel</option>
			        </select>
			    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button></form>
            </div>
            <div className="container">
            <div className="row"  style={{marginTop:"20px"}}>
                { this.state.books.map(function(book){
                    if(book.inventory>-1){
                        return (
                            <div className="col-md-3 col-sm-6 thumbnail">
                                <img src={'http://localhost:5000/'+book.image} alt={book.image} width="150" height="225" /><br></br>
                                <a key={book._id} href={"/books/"+book._id}>{book.title}</a>
                            </div>
                        )
                        
                    }
                        //return <a key={book._id} href={"/books/"+book._id}><li key={book._id}>{book.title}</li></a>
                
                })}
            </div>
            <div style={{marginLeft:"20%"}}>
                {this.state.user.username==="Admin" && <a style={{width:"70%"}} className="btn btn-primary btn-lg" href="/books/new" role="button">new</a>}
            </div>
                
            </div>
            </div>
        );
    };
      
}