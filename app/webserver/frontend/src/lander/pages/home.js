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
          <sup>&#10033;</sup>1938 &ndash; <sup>&dagger;</sup>2020
        </div>
        <br/>
        <div className="text" key="text1">
           Phutball is a 2-player board game invented by the late mathematician John Conway, most famous for the Game of Life.
           The game is described in <i>Winning Ways for your Mathematical Plays</i> (Chapter 22).
        </div>
        <br/>
        <div className="text" key="text2">
           You can play it on this website, currently with 2 humans playing on the same computer. Playing remotely or against a bot are coming soon!
        </div>
        <br/>
        <div className="text" key="text3">
          Scroll down or use the menu to read the rules and then play. You can also read more about John Conway, his life, and works
          under the &ldquo;More Math&rdquo; section
        </div>
      </div>
      </span>
      </div>
  )
  }
}
