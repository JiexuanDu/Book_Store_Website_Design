import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';

export default class Navbar extends Component{

    handleLogout = e =>{
        e.preventDefault();
        cookie.remove("userId", { path: "/" } );
        cookie.remove("userName", { path: "/" } );
        cookie.remove("accessToken", { path: "/" } );
        window.location.href = "/";
      }

    render(){
        return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link to="/homepage" className="navbar-brand">BookStore</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                    <Link to="/homepage" className="nav-link">BookLists</Link>
                    </li>
                    <li className="navbar-item active">
                    <Link to="/orders" className="nav-link">Orders</Link>
                    </li>
                    {cookie.load('userName')!=="Admin" && <li className="navbar-item active"><Link to="/carts" className="nav-link">Cart</Link></li>}
                </ul>
                <ul className="navbar-nav ">
                    <li className="nav-item active">
                    <span className="navbar-text pr-2">Welcome! {cookie.load('userName')}</span>
                    </li>
                    <li className="navbar-item active">
                    <button className="btn btn-outline-success my-2 my-sm-0" onClick={this.handleLogout}>Log out</button>
                    </li>
                </ul>
            </div>
            </nav>
        );
    };
}

