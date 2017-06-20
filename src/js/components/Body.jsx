import Site from '../Site.js';
import React from 'react';
import {render} from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';
import SideNav from './SideNav.jsx';
import Content from './Content.jsx';

const Grid = ReactBootstrap.Grid,
	Row = ReactBootstrap.Row,
	Col = ReactBootstrap.Col;

class Body extends React.Component {
	render() {
		if (this.props.sidebar) {
			var bod = <Grid fluid>
				<Row>
					<Col sm={3}>
						<SideNav />
					</Col>
					<Col sm={9}>
						<Content>{this.props.children}</Content>
					</Col>
				</Row>
			</Grid>;
		} else {
			var bod = <Grid fluid>
				<Row>
					<Col sm={12}>
						<Content>{this.props.children}</Content>
					</Col>
				</Row>
			</Grid>;
		}
		return bod;
	}
}

module.exports = Body;