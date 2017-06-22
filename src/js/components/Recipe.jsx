import React from 'react';
import {render} from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';

const Grid = ReactBootstrap.Grid,
	Row = ReactBootstrap.Row,
	Col = ReactBootstrap.Col,
	Image = ReactBootstrap.Image,
	ListGroup = ReactBootstrap.ListGroup,
	ListGroupItem = ReactBootstrap.ListGroupItem,
	Panel = ReactBootstrap.Panel,
	Badge = ReactBootstrap.Badge;

var axios = require('axios');

class Recipe extends React.Component {
	constructor(props) {
		super(props);

		if (this.props.full === true) {
			var data = JSON.parse(document.querySelector('[name="page-data"]').value);
			this.state = data;
		}
	}

	render() {
		if (this.props.full === true) {

			var image = '';

			if (this.state.imagesrc !== undefined) {
				image = <Image src={this.state.imagesrc} rounded responsive />;
			}

			var ingredients = [];
			for (var i = 0; i < this.state.ingredients.length; i += 1) {
				ingredients.push(<ListGroupItem key={this.state.ingredients[i].id}>{this.state.ingredients[i].content}</ListGroupItem>);
			}

			var directions = [];
			for (var i = 0; i < this.state.directions.length; i += 1) {
				directions.push(<ListGroupItem key={this.state.ingredients[i].id}>{this.state.directions[i].content}</ListGroupItem>);
			}

			var userUrl = "http://reddit.com/u/" + this.state.user;

			return <Grid fluid>
				<Row>
					<Col sm={3}>
						{image}
						<h3>{this.state.title}</h3>
						<h4>By <a href={userUrl}>{this.state.user}</a></h4>
						<p>{this.state.time} minutes</p>
						<p>{this.state.servings} servings</p>
					</Col>
					<Col sm={9}>
						<Panel header="Ingredients">
							{ingredients}
						</Panel>
						<Panel header="Directions">
							{directions}
						</Panel>
					</Col>
				</Row>
			</Grid>;
		}
	}
}

module.exports = Recipe;