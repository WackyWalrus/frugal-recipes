'use strict';

import React from 'react';
import {render} from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';

var axios = require('axios');

const FormGroup = ReactBootstrap.FormGroup,
	ControlLabel = ReactBootstrap.ControlLabel,
	FormControl = ReactBootstrap.FormControl,
	InputGroup = ReactBootstrap.InputGroup,
	Button = ReactBootstrap.Button;

class InteractiveList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var x = 0;
		return (
			<FormGroup>
				<ControlLabel>{this.props.name}</ControlLabel>
				{this.props.items.map((item, index) => (
					<InputGroup key={index}>
						<InputGroup.Addon>{index + 1}</InputGroup.Addon>
						<FormControl
							type="text"
							value={item.value}
							data-index={index}
							data-key={this.props.k}
							onChange={this.props.handler} />
					</InputGroup>	
				))}
			</FormGroup>
		);
	}
}

class UploadForm extends React.Component {
	constructor(props) {
		super(props);
		this.buttonClickHandler = this.buttonClickHandler.bind(this);
		this.interactiveListHandler = this.interactiveListHandler.bind(this);
		this.textChangeHandler = this.textChangeHandler.bind(this);
		this.fileHandler = this.fileHandler.bind(this);
		this.state = {
			recipe: '',
			time: '',
			servings: '',
			ingredients: [{
				'value': ''
			}],
			directions: [{
				'value': ''
			}],
			img: ''
		}
	}

	textChangeHandler(e) {
		this.setState({
			[e.target.getAttribute('k')]: e.target.value
		});
	}

	interactiveListHandler(e) {
		var index = e.target.getAttribute('data-index'),
			key = e.target.getAttribute('data-key'),
			items = this.state[key],
			i;
		if (items[index] === undefined) {
			items[index] = {};
		}
		items[index].value = e.target.value;

		items = items.filter(function (item, index) {
			if (items.length === 1) {
				return item;
			}
			if (item.value.length !== 0) {
				return item;
			}
		});

		items.push({
			'value': ''
		});

		this.setState({
			[key]: items
		});
	}

	buttonClickHandler() {
		var data = this.state;
		data.username = window.user.name;

		axios.post('/save', data).then(function (response) {
			console.log(response.data, JSON.parse(respnse.data));

			var d = JSON.parse(response.data);

			if (d.error !== undefined) {
				console.log(d.error);
				return false;
			}
			window.location.href = '/recipe/' + d.success;
		});
	}

	fileHandler(e) {
		var file = e.target.files[0];
		var _ = this;
		if (file === undefined) {
			return false;
		}

		var reader = new FileReader();
		reader.onloadend = function() {
			_.setState({
				img: reader.result
			});
			console.log(_.state);
		}
		reader.readAsDataURL(file);
	}

	render() {
		return <form>
			<FormGroup>
				<ControlLabel>Recipe Name</ControlLabel>
				<FormControl
					type="text"
					placeholder="Recipe Name"
					value={this.state.recipe}
					k='recipe'
					onChange={this.textChangeHandler} />
			</FormGroup>
			<FormGroup>
				<ControlLabel>Time (minutes)</ControlLabel>
				<FormControl
					type="text"
					placeholder="Time (minutes)"
					value={this.state.time}
					k='time'
					onChange={this.textChangeHandler} />
			</FormGroup>
			<FormGroup>
				<ControlLabel>Servings</ControlLabel>
				<FormControl
					type="text"
					placeholder="Servings"
					value={this.state.servings}
					k='servings'
					onChange={this.textChangeHandler} />
			</FormGroup>
			<InteractiveList items={this.state.ingredients} name="Ingredients" k="ingredients" handler={this.interactiveListHandler} />
			<InteractiveList items={this.state.directions} name="Directions" k="directions" handler={this.interactiveListHandler} />
			<FormGroup>
				<ControlLabel>Picture</ControlLabel>
				<InputGroup>
					<FormControl
						type="file"
						onChange={this.fileHandler} />
				</InputGroup>
			</FormGroup>
			<Button onClick={this.buttonClickHandler}>Upload</Button>
		</form>;
	}
}

module.exports = UploadForm;