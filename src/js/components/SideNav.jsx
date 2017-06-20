import Site from '../Site.js';
import React from 'react';
import {render} from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';

const ListGroup = ReactBootstrap.ListGroup,
	ListGroupItem = ReactBootstrap.ListGroupItem;

class SideNav extends React.Component {
	render() {
		return <ListGroup>
			<ListGroupItem href="#" active="true">All</ListGroupItem>
			<ListGroupItem href="#">Meat</ListGroupItem>
			<ListGroupItem href="#">Turkey</ListGroupItem>
			<ListGroupItem href="#">Chicken</ListGroupItem>
			<ListGroupItem href="#">Seafood</ListGroupItem>
		</ListGroup>;
	}
}

module.exports = SideNav;