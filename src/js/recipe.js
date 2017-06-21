import React from 'react';
import {render} from 'react-dom';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import Wrapper from './components/Wrapper.jsx';
import Navigation from './components/Navigation.jsx';
import Body from './components/Body.jsx';
import Recipe from './components/Recipe.jsx';

var User = require('./components/User.jsx'),
	user = new User();

user.getInfo(function (info) {

	window.user = info;
	var recipeId = parseInt(window.location.pathname.replace('/recipe/', ''), 10);

	class Index extends React.Component {
		render() {
			return <Wrapper>
				<Navigation />
				<Body>
					<Recipe recipeId={recipeId} full />
				</Body>
			</Wrapper>
		}
	}

	render(<Index />, document.getElementById('app'));
});
