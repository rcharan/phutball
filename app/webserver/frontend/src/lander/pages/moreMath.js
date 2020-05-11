import React from "react";

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default class MoreMath extends React.Component {
  render() {
    return (
      <div>
      <span className="title">
        More Fun Things
      </span>
      <span className="text">
      <div className="content">
        <div className="subtitle">
          More about Philospher's Football and other Conway things      
        </div>
        <div className="text">
      <ol> 
        <li>
          Philospher's Football
            <ul>
              <li key="1">To be clear, football refers to what Americans call soccer.
                Conway was English and made his name as a professor
                at the University of Cambridge
              </li>
              <li key="6"> Conway apparently did not  &ldquo;<a
                  href="https://www.wired.com/2015/09/life-games-playful-genius-john-conway/">
                     excel
                  </a>&rdquo; at the game,
                  but he and others played quite a bit at Cambridge.
              </li>
              <li key="2"> The name of the game is a reference to a <a
                href="https://www.youtube.com/watch?v=LfduUFF_i1A">Monty Python skit
              </a> (The Greeks vs the Germans).
              </li>
              <li key="5">Because a 15 by 19 game board is hard to come by
                (whereas a 19x19 game board is a Go Board), it is acceptable to play in a 19x19 format.
              </li>
              <li key="4"> The game has attracted occasional academic interest (i.e. in the form of published 
                papers). In this context, the question is what happens as the board scales in size.
                Square boards are often considered for simplicity. Most interestingly:
                <ul>
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
                </ul>
              </li>
            </ul>
        </li>
        <li>My favorite Conway ingenuity is FRACTRAN. I have intentionally not provided a link so 
          you can spend a few minutes trying to figure out the shenanigans.
          <ol>
            <li>A FRACTRAN program consists of an ordered list of positive fractions in lowest terms.</li>
            <li>A FRACTRAN program takes as input a positive integer n.</li>
            <li>A FRACTRAN program is evaluated by, at each step, finding the first
              fraction <InlineMath math="f"/> in the program such
              that <InlineMath math="nf"/> is an integer. Then <InlineMath math="nf"/> is produced as an output
              and the program recurses with the previous output as a new input.
            </li>
            <li> A FRACTRAN program terminates when no fraction <InlineMath math="f"/> in the list satisfies that <InlineMath math="nf"/> is an integer.</li>
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
              of 2 in order. In other words, it computes the primes.
            </li>
            <li> FRACTRAN is <a
              href="https://en.wikipedia.org/wiki/Turing_completeness">
              Turing-complete</a> (!) and an excellent example
              of an <a href="https://en.wikipedia.org/wiki/Esoteric_programming_language">
              esoteric programming language</a>.
            </li>
          </ol>
        </li>


        <li> (The Monstrous Moonshine)
          Conway is also known for his work on the <a
          href="https://en.wikipedia.org/wiki/Classification_of_finite_simple_groups">
          classification of the Finite Simple Groups.</a> In
          my opinion (and many others&rsquo;) this is one of the greatest
          accomplishments of our kind, taking place across multiple generations and spanning
          centuries.
          <ul>
              <li>
              Conway figured out and wrote down the description of three of the
              26 (or 27, depending how you count &ndash; Conway reportedly counted 27)
              sporadic finite simple groups, the <a
              href="https://en.wikipedia.org/wiki/Conway_group">Conway groups</a>.
              </li>
            <li> He also played an important part in the discovery of the <a
            href="https://en.wikipedia.org/wiki/Monster_group">Monster Group</a>
            </li>
            <li> In particular, in a 1979 paper with Simon Norton, he gave the <a
            href="https://en.wikipedia.org/wiki/Monstrous_moonshine">Monstrous Moonshine
            </a> conjecture. So called because you&rsquo;d have to drink quite a bit of Moonshine to
            believe it. (Spoiler: it is in fact true)
            </li>
          </ul>
        </li>
      </ol>
    </div>
    </div>
    </span>
    </div>

    )
  }
};
