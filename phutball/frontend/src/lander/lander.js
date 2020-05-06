import React from 'react';
import API from '../api'


class LandingPage extends React.Component {

  render() {
    return (
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="stylesheet" href="lander.css">
      </head>
      <body>
          <ul id="menu">
            <a href="#p1"><li class="icon fa fa-bolt" id="uno">A</li></a>
            <a href="#p2"><li class="icon fa fa-keyboard-o" id="dos">B</li></a>
            <a href="#p3"><li class="icon fa fa-rocket" id="tres">C</li></a>
            <a href="./index.html"><li class="icon fa fa-dribbble" id="cuatro">D</li></a>
            <a href="./index.html"><li class="icon fa fa-plus-circle" id="cinco">E</li></a>
          </ul>
          <div class="page" id="p1">
             <section class="icon fa fa-bolt"><span class="title">Bolt</span><span class="hint">Like this pen to see the magic!...<br> Just kidding, it won't happen anything but I'll be really happy If you do so.</span></section>  
          </div>
          <div class="page" id="p2">
             <section class="icon fa fa-bolt"><span class="title">Bolt</span><span class="hint">Hello Again</span></section>  
          </div>
          <div class="page" id="p3">
             <section class="icon fa fa-bolt"><span class="title">Bolt</span><span class="hint">Yes hi</span></section>  
          </div>
      </body>
      </html>
    )
  }


}