import React from 'react';
import './lander.css'
import ScrollNavigation from 'react-single-page-navigation';
import pageNames from './pageNames'
import NavBar from './navbar'

import Home from './pages/home'
import MoreMath from './pages/moreMath'
import Play from './pages/play'
import About from './pages/about'
import Rules from './pages/rules'

const content = [
  <Home/>,
  <Rules/> ,
  <Play/>  ,
  <MoreMath/>,
  <About/>   ,
]

var elements = {}
pageNames.forEach(name => (elements[name] = {}))

export default class LandingPage extends React.Component {

  render() {
    return (
        <ScrollNavigation elements={elements}>
          {({ refs, activeElement, goTo }) => (
            <div className="lander">
              <NavBar active={activeElement} onClick={pageName => goTo(pageName)}/>
              <div id="content">
                {content.map((pageContent, i) => 
                  <div className="page" key={i} id={pageNames[i]} ref={refs[pageNames[i]]}>
                    <section className="pagecontent">
                      {pageContent}
                    </section>
                  </div>
                )}
              </div>
            </div>
          )}
     </ScrollNavigation>

    )
  }

}
