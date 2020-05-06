// import ReactDOM from 'react-dom';

import  React, { Component } from  'react';
import { BrowserRouter } from  'react-router-dom'
import { Route } from  'react-router-dom'
import  './App.css';
import './index.css';
import Game from './components/game'
	


const  BaseLayout  = () => (
	<div  className="container-fluid">
	    <div  className="content">
	        <Route  path="/game/"    exact component={Game}  />
	        <Route  path="/game/:pk" exact component={Game} />
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
