import React, { Component } from 'react';
import { Button, Form} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from 'axios';
import cookie from 'react-cookies';
import {toast} from 'react-toastify';
import "../App.css";

toast.configure();
export default class Login extends Component{
    constructor(props){
      super(props);

      this.state = {
        username: '',
        password: '',
      };
    }

    handleLogin = e => {
      e.preventDefault();

      const username = this.state.username;
      const password = this.state.password;
      const props = this.props;

      if(username !== '' && password !=='' ){
        axios.post(
          'http://localhost:5000/users/login',
          {
            "username": username,
            "password": password
          }
        )
        .then(function (response){
          if(response.data.success){
            //console.log(response.data.message);
            //console.log(response.data.LoginUser);
            
            cookie.save('userName',response.data.LoginUser.username,{path:"/"});
            cookie.save('userId',response.data.LoginUser._id,{path:"/"});
            cookie.save('accessToken',response.data.accessToken,{path:"/"});
            console.log(cookie.load('userName'));
            toast.success('Welcome '+response.data.LoginUser.username,{autoClose: 2500});
            props.history.push('/homepage');

          }
          else{
            toast.success(response.data.message,{autoClose: 2500});
            console.log(response.data.message);
          }
        })
        .catch(function (error){
          console.log(error);
          
        })
      }
      else{
        toast.warn('empty input not allowed',{autoClose: 2500});
      }
    }

    handleUserName = e =>{
      e.preventDefault();
      this.setState({
        username: e.target.value
      });
    }

    handlePassword = e =>{
      e.preventDefault();
      this.setState({
        password: e.target.value
      });
    }

    render(){
     return(
        <div className="wrapper">
          <div className="form-wrapper">
          <Form onSubmit={this.handleLogin}>
            <Form.Group controlId="formBasicEmail">
              <h3 className="text-center">BookStore Login</h3>
              <h5 className="text-center">Welcome back</h5>
              <Form.Label>Username</Form.Label>
              <Form.Control onChange={this.handleUserName} type="text" placeholder="Enter username" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control onChange={this.handlePassword} type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" block type="submit">
                LOGIN
            </Button>
            <Form.Text className="text-muted">
                Don't have an account? <Link to="/register">Register here!</Link>
            </Form.Text>
          </Form>
          </div>
      </div>
     );
    };
}