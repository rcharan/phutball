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
  [`Philospher's Football`  , <Home/>    ],
  ['Rules'                  , <Rules/>   ],
  ['Play'                   , <Play/>    ],
  ['More Fun Things'        , <MoreMath/>],
  ['About'                  , <About/>   ],
]




export default class LandingPage extends React.Component {

  render() {
    return (
        <ScrollNavigation elements={{ home: {}, rules: {}, about:{}, moremath:{}, play:{}}}>
          {({ refs, activeElement, goTo }) => (
            <div className="lander home">
              <NavBar onClick={pageName => goTo(pageName)}/>
              <div id="content">
                {content.map((pageContent, i) => 
                  <div className="page" id={'p'+(i+1)} ref={refs[pageNames[i]]}>
                    <section className="icon">
                    <span className="title">
                      {pageContent[0]}
                    </span>
                    <span className="text">
                      {pageContent[1]}
                    </span>
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
