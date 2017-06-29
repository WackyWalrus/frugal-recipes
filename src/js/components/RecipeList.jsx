import React from 'react';
import {render} from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';
import Recipe from './Recipe.jsx';

var Url = require('url'),
	url = Url.parse(window.location.href);

var query = '';

if (url.query !== null &&
		url.query.indexOf('q=') !== -1) {
	var split = url.query.split('&');
	for (var i = 0; i < split.length; i += 1) {
		if (split[i].indexOf('q=') == 0) {
			query = split[i].replace('q=', '');
		}
	}
}

const Form = ReactBootstrap.Form,
	FormGroup = ReactBootstrap.FormGroup,
	FormControl = ReactBootstrap.FormControl,
	Button = ReactBootstrap.Button,
	Grid = ReactBootstrap.Grid,
	Row = ReactBootstrap.Row,
	Col = ReactBootstrap.Col;

class RecipeList extends React.Component {
	constructor(props) {
		super(props);

		this.inputChange_handler = this.inputChange_handler.bind(this);

		var data = document.getElementById('recipe-data').value;
		if (data !== '{recipe-data}') {
			data = JSON.parse(data);
		} else {
			data = [];
		}

		this.state = {
			recipes: [],
			query: query
		};

		var i;

		for (i = 0; i < data.length; i += 1) {
			this.state.recipes.push(<Recipe key={data[i].id} data={data[i]} />);
		}
	}

	inputChange_handler(e) {
		this.setState({
			query: e.target.value
		});
	}

	render() {
		var search = '';
		if (this.props.search) {
			search = <Form method="get" action="/">
				<FormGroup>
						<Row>
							<Col sm={10}>
								<FormControl
									type="text"
									placeholder="Search..."
									name="q"
									value={this.state.query}
									onChange={this.inputChange_handler}
								/>
							</Col>
							<Col sm={2}>
								<Button bsClass="btn btn-default pull-right">Run Search</Button>
							</Col>
						</Row>
				</FormGroup>
			</Form>
		}
		return <div className="recipeList">
			{search}
			<div className="recipes">
				{this.state.recipes}
			</div>
		</div>;
	}
}

module.exports = RecipeList;