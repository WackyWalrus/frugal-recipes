import React from 'react';
import {render} from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';
import Recipe from './Recipe.jsx';

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

		var data = document.getElementById('recipe-data').value;
		if (data !== '{recipe-data}') {
			data = JSON.parse(data);
		} else {
			return false;
		}

		this.state = {
			recipes: []
		};

		var i;

		for (i = 0; i < data.length; i += 1) {
			this.state.recipes.push(<Recipe key={data[i].id} data={data[i]} />);
		}
	}

	render() {
		var search = '';
		if (this.props.search) {
			search = <Form>
				<FormGroup>
						<Row>
							<Col sm={10}>
								<FormControl
									type="text"
									placeholder="Search..."
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