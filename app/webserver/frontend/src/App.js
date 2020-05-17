// import ReactDOM from 'react-dom';

import  React, { Component } from  'react';
import { BrowserRouter } from  'react-router-dom'
import { Switch, Route } from  'react-router-dom'
import PlayerSelector from './components/playerSelector'
import  './App.css';
// import './index.css';
import Game from './components/game'
import Lander from './lander/lander'

// const BrowserHistory = require('react-router/lib/BrowserHistory').default;

const  BaseLayout  = () => (
	<div  className="container-fluid">
	    <div  className="content">
	    	<Switch>
	        	<Route path="/game/:gameID">
					<Game
						type        = "local"
						localPlayer = {null}
					/>
	        	</Route>
	        	<Route path="/live/:gameID/X">
	        		<Game
	        			type        ="live"
	        			localPlayer = {false}
	        		/>
	        	</Route>
	        	<Route path="/live/:gameID/O">
	        		<Game
	        			type        ="live"
	        			localPlayer = {true}
	        		/>
	        	</Route>
	        	<Route path="/live/:gameID">
	        		<PlayerSelector/>
	        	</Route>
		    	<Route path="/">
		    		<Lander/>
		    	</Route>
		    </Switch>
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
