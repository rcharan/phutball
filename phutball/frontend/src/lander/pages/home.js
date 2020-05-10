import React from "react";
import { ReactComponent as EyeCandy } from '../../icons/philosphers-play-football.svg'

export default class Home extends React.Component {
  render() {
    return (
      <div>
      <div className="logo float" key="1">
        <EyeCandy/>
      </div>
      <span className="title">
        Philosopher&rsquo;s Football
      </span>
      <span className="text">
      <div className="content" key="2">
        <div className="subtitle" id="sub">In honor of John Conway,
          <sup>&#10033;</sup>1938 &ndash; <sup>&dagger;</sup>2020</div>
          <br/>
        <div className="text" id="text1">
           John Conway was a complex self-replicating system who famously studied simpler self-replicating systems and was ultimately undone by one (a virus).
        </div><br/>
        <div className="text" id="text2">
           He's most famous for the Game of Life, a fantabulously simple construct that exhibits complex emergent phenomena. The &ldquo;game&rdquo; is also Turing complete
            &ndash; you can simulate any classical computer in it (!) &ndash; and it is possible to build self-replicating systems inside as well.
        </div>
        <br/>
        <div className="text" id="text3">
          But his contributions to our kind are numerous. This website is for <b>Philosopher's Football</b> (also known as phutball),
           a game described in <i>Winning Ways for your Mathematical Plays</i> (Chapter 22).
        </div>
        <br/>
        <div className="text" id="text3">
          You can find the rules to the game in the menu on the left. Then you can play it! It's a two-player game, so you'll
          have to find someone to play with (on the same computer). You can also find more about the game and other fun things
          from the mind of John Conway under &ldquo;More Math&rdquo;
        </div>
      </div>
      </span>
      </div>
  )
  }
}
