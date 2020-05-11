import React from "react";
import { version, releaseDate } from '../../settings/settings'
import { ReactComponent as EyeCandy } from '../../icons/philosphers-play-football.svg'

export default class About extends React.Component {
  render() {
    return (
    <div className="aboutContent">
      <div className="content" key="1">
      	<p>Philosopher&rsquo;s Football by <a className="silent" href="http://www.ravicharan.com">Ravi Charan</a>.
      	View the code on <a href="https://github.com/rcharan/phutball">Github
      	</a> or contact me via my <a href="http://www.ravicharan.com">website
        </a> or <a href="https://www.linkedin.com/in/ravimcharan/">LinkedIn</a>.</p>
      </div>
      <EyeCandy/>
      <div className="footer" key="2">
      	Version {version} ({releaseDate}). philosophers.football &copy;2020 by Ravi Charan, Charan Laboratories
      </div>
     </div>
    )
  }
};
