import React from 'react';
import './lander.css'
import GameCreator from './gameCreator'

/*
@author Alberto Hartzet 
*
*I wouldn't mind if you use this piece of code in your project as long 
as you give credit with a link to my site. www.albertohartzet.com
*
Licence (CC BY-NC-SA 4.0) http://creativecommons.org/licenses/by-nc-sa/4.0/
*/

export default class LandingPage extends React.Component {

  render() {
    return (
      <div class="landing-page">
          <ul id="menu">
            <a href="#p1"><li class="icon fa fa-bolt" id="uno">Hello</li></a>
            <a href="#p2"><li class="icon fa fa-keyboard-o" id="dos">Rules</li></a>
            <a href="#p3"><li class="icon fa fa-rocket" id="tres">Conway</li></a>
            <a href="#p4"><li class="icon fa fa-dribbble" id="cuatro">Play</li></a>
            <a href="#p5"><li class="icon fa fa-plus-circle" id="cinco">About</li></a>
          </ul>
          <div class="page" id="p1">
            <section class="icon fa fa-bolt">
            <span class="title">Hello</span>
            <span class="hint">
              Some welcome text goes here
            </span>
            </section>
          </div>
          <div class="page" id="p2">
             <section class="icon fa fa-bolt">
             <span class="title">Rules</span>
             <span class="hint">Rules go here</span>
             </section>  
          </div>
          <div class="page" id="p3">
             <section class="icon fa fa-bolt">
             <span class="title">John Conway</span>
             <span class="hint">Some more facts about him</span>
             </section>  
          </div>
          <div class="page" id="p4">
             <section class="icon fa fa-bolt">
             <span class="title">Play</span>
             <span class="hint"><GameCreator /></span>
             </section>  
          </div>
           <div class="page" id="p5">
             <section class="icon fa fa-bolt">
             <span class="title">About</span>
             <span class="hint">Some about info goes here</span>
             </section>  
          </div>

      </div>
    )
  }

}
