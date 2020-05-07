import React from "react";

// import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default class MoreMath extends React.Component {
  render() {
    return (
      <div class="content">
        <div class="subtitle">
          More about Philospher's Football and other Conway things      
        </div>
        <div class="text">
      <ol> 
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
};
