import React from 'react';
import './lander.css'
import GameCreator from './gameCreator'
import { ReactComponent as Home     } from '../icons/home.svg'
import { ReactComponent as Play     } from '../icons/play.svg'
import { ReactComponent as Rules    } from '../icons/rule-icon.svg'
import { ReactComponent as About    } from '../icons/about2.svg'
import { ReactComponent as MoreMath } from '../icons/tesseract.svg'

import { ReactComponent as RulesA   } from '../icons/rules-a.svg'
import { ReactComponent as RulesB   } from '../icons/rules-b.svg'
import { ReactComponent as RulesC   } from '../icons/rules-c.svg'

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';


function homeContent() {
  return (
    <div class="content">
    <div class="subtitle" id="sub">In honor of John Conway,
      <sup>&#10033;</sup>1938 &ndash; <sup>&dagger;</sup>2020</div>
      <br/>
    <div class="text" id="text1">
       John Conway was a complex self-replicating system who famously studied simpler self-replicating systems and was ultimately undone by one (a virus).
    </div><br/>
    <div class="text" id="text2">
       He's most famous for the Game of Life, a fantabulously simple construct that exhibits complex emergent phenomena. The &ldquo;game&rdquo; is also Turing complete
        &ndash; you can simulate any classical computer in it (!) &ndash; and it is possible to build self-replicating systems inside as well.
    </div>
    <br/>
    <div class="text" id="text3">
      But his contributions to our kind are numerous. This website is for <b>Philosopher's Football</b> (also known as phutball),
       a game described in <i>Winning Ways for your Mathematical Plays</i> (Chapter 22).
    </div>
    <br/>
    <div class="text" id="text3">
      You can find the rules to the game in the menu on the left. Then you can play it! It's a two-player game, so you'll
      have to find someone to play with (on the same computer). You can also find more about the game and other fun things
      from the mind of John Conway under &ldquo;More Math&rdquo;
    </div>
    </div>

  )
}

function rulesContent() {
  return (
  <div class="rules">
  <RulesA/>
  <RulesB/>
  <RulesC/>
  </div>
  )

  /*
  return (
    <div class="content">
    <div class="text">
    <ol>
      <li key="1">
           (The Players) The game is played by two players, traditionally called X's and O's.
           X plays towards the right, and O towards the left.
           Players alternate turns, and X plays first.
      </li>
      <li key="2"> 
           (The Equipment) The game is played with equipment similar to the game of Go.
           However, there is one white stone (the ball) and an unlimited number
           of black stones (the players). The board is a 15x19 grid with pieces
           placed on the intersection points. The rows are lettered A-B-C-D-E-F-G-H-J-K-L-M-N-O-P
           (there is no I row) and the columns are numbered 1&ndash;19. Columns 0 and 20
           exist (conceptually) as well, though they are not on the board.
      </li>
      <li key="3">
          (Initial Condition) At the beginning of the game, the ball is placed in the center of the pitch
          and the rest of the board is empty.
      </li>
      <li key="4">
        (Dynamics \&ndash; Placement) On each players turn, they may either place a player on an unoccupied position on
        the board or move the ball by making a <b>jump</b>
      </li>
      <li key="5"> 
        (Dynamics \&ndash; Jumping) A jump may be in any of the 8 directions: 2 lateral, 2 vertical, and 4 diagonal.
        The jump must be over a player, similar to checkers, and the players are removed once jumped over. However, the ball may jump an arbitrary number of 
        players (1, 2, or more) lying in a straight line in one go. Moreover, after landing, another jump may be taken (in any
        direction) over another set of players as part of the same move, and then another jump if desired, and so on ad nauseum.
      </li>
      <li key="6">
        (Jumps \&ndash; Restrictions). When a player is jumped over, they are immediately removed. They may not be
        jumped over again as part of a sequence of jumps making up a single player's move. Jumps are legal if they
        land on any part of the board, and they may be continued from there. Jumps may also go off the board on the left and right.
        However, a jump that lands off the right or left end of the board may not be continued.
      </li>
      <li key="7">
        (Win Condition) The game ends with a victory for X if a turn ends with the ball on or past the right goalline,
        namely in the last column on the right or over it into column 20. Likewise, it is a victory for O if the game ends
        on or past the left goalline (columns 1 and 0 respectively).
      </li>
      </ol></div></div>
  )
  */
}

function playContent() {
  return <GameCreator />
}

/*
        <li>
          Philospher's Football
            <ol>
              <li key="1">To be clear, football refers to what Americans call soccer.
                Conway was English and made his name as a professor
                at the University of Cambridge
              </li>
              <li key="6"> Conway apparently did not <a
                  href="https://www.wired.com/2015/09/life-games-playful-genius-john-conway/">
                      &ldquo;excel&rdquo;
                  </a> at the game,
                  but he and others played quite a bit at Cambridge.
              </li>
              <li key="2"> The name of the game is a reference to a <a
                href="https://www.youtube.com/watch?v=LfduUFF_i1A">Monty Python skit
              </a>.
              </li>
              <li key="5">Because a 15 by 19 game board is hard to come by
                (whereas a 19x19 game board is a Go Board), it is common to play in a 19x19 format.
              </li>
              <li key="4"> The game has attracted occasional academic interest (i.e. in the form of published 
                papers). In this context, the question is what happens as the board scales in size.
                Square boards are often considered for simplicity. Most interestingly:
                <ol>
                  <li key="1"> It is <a href="https://arxiv.org/abs/cs/0008025">NP-complete
                  </a> to
                    determine whether there is a win-in-one move in phutball. (Erik Demaine, Martin Demaine, and David Eppstein)
                  </li>
                  <li key="2">Even the 1-dimensional version of the game is <a
                      href="http://library.msri.org/books/Book42/files/grossman.pdf">
                      difficult to analyze
                    </a>. (J.P. Grossman and Richard Nowakowski). In particular, it can
                    be advantageous to move backwards!
                  </li>
                </ol>
              </li>
            </ol>
        </li>
        <li>My favorite Conway ingenuity is FRACTRAN. I have intentionally not provided a link so 
          you can spend a few minutes trying to figure out the shenanigans.
          <ol>
            <li>A FRACTRAN program consists of an ordered list (possibly infinite) of positive fractions in lowest terms.</li>
            <li>A FRACTRAN program takes as input a positive integer n.</li>
            <li>A FRACTRAN program is evaluated by, at each step, find the first
              fraction <InlineMath math="f"/> in the program such
              that <InlineMath math="nf"/> is an integer. Then <InlineMath math="nf"/> is produced as an output
              and the program recurses with the previous output as a new input.
            </li>
            <li> The program terminates when no fraction <InlineMath math="f"/> in the list satisfies that <InlineMath math="nf"/> is an integer.</li>
            <li> The program
              <BlockMath math="\left(
                \frac{17}{91},
                \frac{78}{85},
                \frac{19}{51},
                \frac{23}{38},
                \frac{29}{33},
                \frac{77}{29},
                \frac{95}{23},
                \frac{77}{19},
                \frac{1 }{17},
                \frac{11}{13},
                \frac{15}{2 },
                \frac{1 }{ 7},
                \frac{55}{ 1}
              \right)"/> with input <InlineMath math="n = 2"/> produces a series of outputs
              which, when filtered to restrict to powers of 2, gives exactly the prime powers
              of 2 in order. Go Figure[]
            </li>
          </ol>
        </li>
*/
function mathContent() {
  return (
    <div class="content">
    <div class="subtitle">
      More about Philospher's Football and other Conway things      
    </div>
    <div class="text">
      <ol> 

        <li> (The Monstrous Moonshine) Conway is also known for his work on the classification of the Finite Simple Groups.
          <ol>
            <li> A <a
                    href="https://en.wikipedia.org/wiki/Group_(mathematics)">group
                  </a> is one of the simplest mathematical structures</li>
            <li> It is, in my opinion (and many others&rsquo;) one of the greatest
              accomplishments of our civilization that, over the course of (approximately) the 20<sup>th</sup>
              century, mathematicians managed to classify all the finite groups.
              (Technically, we classified all the <a
                  href="https://en.wikipedia.org/wiki/Classification_of_finite_simple_groups">finite <i>simple</i> groups</a>, which (provably)
                  are the building blocks of all of the finite groups). This was a collective endeavour
                  stretching across generations with roots back towards the beginning of the 19<sup>th</sup> century.
            </li>
            <li> The finite simple groups come in 18 infinite families, plus 26 sporadic groups, plus 1 group
            (the <a href="https://en.wikipedia.org/wiki/Tits_group">Tits group</a>) that could be considered
            part of one of the families but sometimes isn't (including, reportedly, by Conway).</li>
            <li> Conway figured out and wrote down the description of three of the sporadic finite simple groups
            (the <a href="https://en.wikipedia.org/wiki/Conway_group">Conway groups</a>). He also gave a simplified
            construction (with Jacque Tits) of the Monster group in the mid-80s.</li>
            <li> The monstrous moonshine hypothesis is... something about math... and somehow explains
            gravity?</li>
          </ol>
        </li>
      </ol>
    </div>
    </div>

  )
}

function aboutContent() {
  return 'About blah'
}

const content = [
  [`Philospher's Football`  , homeContent() ],
  ['Rules'  , rulesContent()   ],
  ['Play'   , playContent()    ],
  ['More Fun Things', mathContent()  ],
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
