import React from "react";

import { ReactComponent as RulesD   } from '../../icons/rules-d.svg'

export default class Rules extends React.Component {
  render() {
    return (
      <div>
	    <span className="title">
          Rules
        </span>
      <span className="text">
        <RulesD/>
      </span>
      </div>
    );
  }

};
