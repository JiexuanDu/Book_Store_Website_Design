import React from 'react';
import { BrowserRouter,Switch, Router, Route } from 'react-router-dom';
// eslint-disable-next-line
import "bootstrap/dist/css/bootstrap.min.css";
// eslint-disable-next-line
import "react-toastify/dist/ReactToastify.css"

import LoginPage from "./components/login";
import RegisterPage from "./components/register";
import homepage from "./components/homepage";
import Carts from "./components/cart";
import Books from "./components/book";
import Orders from "./components/order";
import Edit from "./components/edit";
import New from "./components/new";


//const showBook = (props) => {return <ShowBook id={props.match.params.id} />}

function App() {
  return (
    
    <BrowserRouter>
      <Route exact path="/" component={LoginPage}></Route>
      <Route path="/register"  component={RegisterPage}></Route> 
      <Route path="/homepage"  component={homepage}></Route>
      <Route path="/carts"  component={Carts}></Route>
      <Route path="/orders"  component={Orders}></Route>
      
      {/* avoid conflict */}
      <Switch>
      <Route path="/books/edit/:id"  component={(props) => <Edit id={props.match.params.id}/>}></Route>
      <Route path="/books/new" component={New}></Route>
      <Route path="/books/:id" component={(props) => <Books id={props.match.params.id} />}></Route>
     </Switch>
      
    </BrowserRouter>
     
  );
}


      //<Route path="/" exact component={homepage} />
      //<Route path="/edit/:id" exact component={EditBook} />
      //<Route path="/create" exact component={CreateBook} />
export default App;
