'use strict';

import React from 'react';
import {render} from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';

const FormGroup = ReactBootstrap.FormGroup,
	ControlLabel = ReactBootstrap.ControlLabel,
	FormControl = ReactBootstrap.FormControl,
	InputGroup = ReactBootstrap.InputGroup,
	Button = ReactBootstrap.Button;

class InteractiveList extends React.Component {
	constructor(props) {
		super(props);
		this.handleItemChange = this.handleItemChange.bind(this);
		this.state = props;
	}

	handleItemChange(e) {
		var index = e.target.getAttribute('data-index'),
			items = this.state.items,
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
			'items': items
		});
	}

	render() {
		var x = 0;
		return (
			<FormGroup>
				<ControlLabel>{this.props.name}</ControlLabel>
				{this.state.items.map((item, index) => (
					<InputGroup key={index}>
						<InputGroup.Addon>{index + 1}</InputGroup.Addon>
						<FormControl
							type="text"
							value={item.value}
							data-index={index}
							onChange={this.handleItemChange} />
					</InputGroup>	
				))}
			</FormGroup>
		);
	}
}

class UploadForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ingredients: [{
				'value': ''
			}],
			directions: [{
				'value': ''
			}]
		}
	}

	render() {
		return <form>
			<FormGroup>
				<ControlLabel>Recipe Name</ControlLabel>
				<FormControl
					type="text"
					placeholder="Recipe Name" />
			</FormGroup>
			<FormGroup>
				<ControlLabel>Time (minutes)</ControlLabel>
				<FormControl
					type="text"
					placeholder="Time (minutes)" />
			</FormGroup>
			<FormGroup>
				<ControlLabel>Servings</ControlLabel>
				<FormControl
					type="text"
					placeholder="Servings" />
			</FormGroup>
			<InteractiveList items={this.state.ingredients} name="Ingredients" />
			<InteractiveList items={this.state.directions} name="Directions" />
			<FormGroup>
				<ControlLabel>Picture</ControlLabel>
				<InputGroup>
					<FormControl
						type="file" />
				</InputGroup>
			</FormGroup>
			<Button>Upload</Button>
		</form>;
	}
}

module.exports = UploadForm;