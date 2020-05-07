import React from "react";

import { ReactComponent as RulesA   } from '../../icons/rules-a.svg'
import { ReactComponent as RulesB   } from '../../icons/rules-b.svg'
import { ReactComponent as RulesC   } from '../../icons/rules-c.svg'


export default class Rules extends React.Component {
  render() {
    return (
      <div>
        <RulesA/>
        <RulesB/>
        <RulesC/>
      </div>
    );
  }

};
