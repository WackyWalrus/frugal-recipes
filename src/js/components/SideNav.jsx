import Site from '../Site.js';
import React from 'react';
import {render} from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';

var axios = require('axios');

const ListGroup = ReactBootstrap.ListGroup,
	ListGroupItem = ReactBootstrap.ListGroupItem;

class SideNav extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		var _ = this;
		axios.get('/categories').then(function (response) {
			var data = response.data;
			var list = [];

			for (var i = 0; i < data.length; i += 1) {
				if (data[i].id === _.props.category) {
					list.push(<ListGroupItem key={data[i].id} href={"/?category=" + data[i].id} active="true">{data[i].title}</ListGroupItem>);
				} else {
					list.push(<ListGroupItem key={data[i].id} href={"/?category=" + data[i].id}>{data[i].title}</ListGroupItem>);
				}
			}
			_.setState({
				list: list
			});
		});
	}
	render() {
		if (this.props.category === 0) {
			return <ListGroup>
				<ListGroupItem href="/" active="true">All</ListGroupItem>
				{this.state.list}
			</ListGroup>;			
		}
		return <ListGroup>
			<ListGroupItem href="/">All</ListGroupItem>
			{this.state.list}
		</ListGroup>;
	}
}

module.exports = SideNav;