import Site from '../Site.js';
import React from 'react';
import {render} from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';
import RecipeList from './RecipeList.jsx';

const Grid = ReactBootstrap.Grid,
	Row = ReactBootstrap.Row,
	Col = ReactBootstrap.Col;

var axios = require('axios');

class Profile extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			recipes: {}
		};
	}

	componentDidMount() {
		var _ = this;
		axios.get('/recipes-from/' + this.props.user).then(function (response) {
			var data = response.data;
			_.setState({
				recipes: data
			})
		});
	}

	render() {
		return <Grid>
			<Row>
				<Col sm={3}>
					<h2>{this.props.user}</h2>
				</Col>
				<Col sm={9}>
					<RecipeList recipes={this.state.recipes} />
				</Col>
			</Row>
		</Grid>;
	}
}

module.exports = Profile;