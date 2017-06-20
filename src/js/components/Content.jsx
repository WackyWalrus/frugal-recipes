import Site from '../Site.js';
import React from 'react';
import {render} from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';

class Content extends React.Component {
	render() {
		return <div>{this.props.children}</div>;
	}
};

module.exports = Content;