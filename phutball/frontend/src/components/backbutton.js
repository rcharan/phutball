import React from 'react';
import { ReactComponent as Home     } from '../icons/home.svg'
import { withRouter } from 'react-router-dom'

class BackButton extends React.Component {
	render() {
		return (
			<button
				type="button"
				onClick={() => this.props.history.push('/')}
			>
				<Home/>
			</button>
		)
	}
}


export default withRouter(BackButton)