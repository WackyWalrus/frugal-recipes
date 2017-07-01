import Site from '../Site.js';
import React from 'react';
import {render} from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';

class Profile extends React.Component {
	render() {
		console.log(this.props.user);
		return <div>woo</div>;
	}
}

module.exports = Profile;