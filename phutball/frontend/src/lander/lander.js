import React from 'react';
import './lander.css'
import GameCreator from './gameCreator'
import { ReactComponent as Home     } from '../icons/home.svg'
import { ReactComponent as Play     } from '../icons/play.svg'
import { ReactComponent as Rules    } from '../icons/rules.svg'
import { ReactComponent as About    } from '../icons/about2.svg'
import { ReactComponent as MoreMath } from '../icons/tesseract.svg'



function homeContent() {
  return (
    <div class="content">
    <div class="subtitle" id="sub">In honor of John Conway,
      <sup>&#10033;</sup>1938 &ndash; <sup>&dagger;</sup>2020</div>
      <br/>
    <div class="text" id="text1">
       John Conway was a complex self-replicating system who famously studied simple self-replicating systems and was ultimately undone by one (a virus)
    </div><br/>
    <div class="text" id="text2">
       He's most famous for the Game of Life, a fantabulously simple construct that exhibits complex emergent phenomena. The game is also Turing complete
        &ndash; you can simulate any classical computer in it (!) &ndash; and it is possible to build self-replicating systems inside as well.
    </div>
    <br/>
    <div class="text" id="text3">
      But his contributions are numerous. This website is for to <b>Philosopher's Football</b> (also known as phutball),
       a game described in <i>Winning Ways for your Mathematical Plays</i> (Chapter 22)
    </div>
    <br/>
    <div class="text" id="text3">
      You can find the rules to the game in the menu on the left. Then you can play it! It's a two-player game, so you'll
      have to find someone to play with (on the same computer). You can also find more about the game and other fun things
      from the mind of John Conway.
    </div>
    </div>

  )
}

function rulesContent() {
  return (
    <div class="content">
    <ol>
      <li> The game is played by two players, traditionally called X's and O's.
           X plays towards the right, and O towards the left.
           X plays first.</li>
      <li> 
  )
}

function conwayContent() {
  return 'About John Conway'
}

function playContent() {
  return <GameCreator />
}

function aboutContent() {
  return 'About blah'
}

function mathContent() {
  return 'Math'
}

const content = [
  [`Philospher's Football`  , homeContent() ],
  ['Rules'  , rulesContent()   ],
  ['Play'   , playContent()    ],
  ['More Math', mathContent()  ],
  ['About'  , aboutContent()   ]
]

const menuContent = [
  <div><div className="glyph"><Home    /></div><div>Home</div></div>,
  <div><div className="glyph"><Rules   /></div><div>Rules  </div></div>,
  <div><div className="glyph"><Play    /></div><div>Play   </div></div>,
  <div><div className="glyph"><MoreMath/></div><div>More Math</div></div>,
  <div><div className="glyph"><About   /></div><div>About  </div></div>,
]


export default class LandingPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page : 0
    }
  }

  handleClick(pageNum) {
    this.setState({page : pageNum})
  }

  doNothing() {
    return null
  }

  render() {
    return (
      <div className="lander home">
          <ul id="menu">
            {menuContent.map((content, i) => 
              <li className="icon link" onClick={() => this.handleClick(i)} key={i}>
                  {content}
              </li>
            )}
          </ul>
          <div className="page" id={'p'+(this.state.page+1)}>
            <section className="icon">
            <span className="title">
              {content[this.state.page][0]}
            </span>
            <span className="text">
              {content[this.state.page][1]}
            </span>
            </section>
          </div>
      </div>
    )
  }

}
