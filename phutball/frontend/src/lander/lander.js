import React from 'react';
import './lander.css'
import GameCreator from './gameCreator'

const content = [
  ['Hello' , 'Hello'  , welcomeContent() ],
  ['Rules' , 'Rules'  , rulesContent()   ],
  ['Conway', 'Conway' , conwayContent()  ],
  ['Play'  , 'Play'   , playContent()    ],
  ['About' , 'About'  , aboutContent()   ]
]

function welcomeContent() {
  return 'Welcome to blah'
}

function rulesContent() {
  return 'Here be Rules'
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
            {content.map((list, i) => 
              <li className="icon link" onClick={() => this.handleClick(i)} key={i}>
                {list[0]}
              </li>
            )}
          </ul>
          <div className="page" id={'p'+(this.state.page+1)}>
            <section className="icon">
            <span className="title">
              {content[this.state.page][1]}
            </span>
            <span className="text">
              {content[this.state.page][2]}
            </span>
            </section>
          </div>
      </div>
    )
  }

}
