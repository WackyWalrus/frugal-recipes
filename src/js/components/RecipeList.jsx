import React from 'react';
import {render} from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';

const Form = ReactBootstrap.Form,
	FormGroup = ReactBootstrap.FormGroup,
	FormControl = ReactBootstrap.FormControl,
	Button = ReactBootstrap.Button,
	Grid = ReactBootstrap.Grid,
	Row = ReactBootstrap.Row,
	Col = ReactBootstrap.Col;

class RecipeList extends React.Component {
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
		return <div className="recipeList">{search}</div>;
	}
}

module.exports = RecipeList;