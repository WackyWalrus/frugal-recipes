import React from 'react';
import {render} from 'react-dom';

class Wrapper extends React.Component {
	render() {
		return <div className="wrapper">{this.props.children}</div>;
	}
}

module.exports = Wrapper;