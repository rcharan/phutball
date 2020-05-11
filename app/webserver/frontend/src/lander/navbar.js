import React from 'react';
import { ReactComponent as Home     } from '../icons/home.svg'
import { ReactComponent as Play     } from '../icons/play.svg'
import { ReactComponent as Rules    } from '../icons/rule-icon.svg'
import { ReactComponent as About    } from '../icons/about2.svg'
import { ReactComponent as MoreMath } from '../icons/tesseract.svg'

import pageNames from './pageNames'

const menuContent = [
  [<Home/>     ,'Home'     ],
  [<Rules/>    ,'Rules'    ],
  [<Play/>     ,'Play'     ],
  [<MoreMath/> ,'More Math'],
  [<About/>    ,'About'    ],
].map(item =>
    <div>
      <div className="glyph" key="icon">{item[0]}</div>
      <div key="desc">{item[1]}</div>
    </div>)


export default class NavBar extends React.Component {
  render() {
    return (
      <ul id="menu">
        {menuContent.map((content, i) => 
        <li
          className="icon link"
          active={pageNames[i]===this.props.active ? 'yes' : 'no'}
          onClick={() => this.props.onClick(pageNames[i])}
          key={i}>
          {content}
        </li>
        )}
      </ul> 
    )
  }
}
