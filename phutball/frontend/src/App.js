// import ReactDOM from 'react-dom';

import  React, { Component } from  'react';
import { BrowserRouter } from  'react-router-dom'
import { Route } from  'react-router-dom'
import  './App.css';
// import './index.css';
import Game from './components/game'
import Lander from './lander/lander'


const  BaseLayout  = () => (
	<div  className="container-fluid">
	    <div  className="content">
	    	<Route  path="/"             exact component={Lander} />
	        <Route  path="/game/:gameID" exact component={Game}   />
	    </div>
	</div>
)

class  App  extends  Component {

	render() {
	    return (
	    <BrowserRouter>
	        <BaseLayout/>
	    </BrowserRouter>
	    );
	}
}


export  default  App;
