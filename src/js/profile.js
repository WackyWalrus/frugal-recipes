import React from 'react';
import {render} from 'react-dom';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import Wrapper from './components/Wrapper.jsx';
import Navigation from './components/Navigation.jsx';
import Body from './components/Body.jsx';
import RecipeList from './components/RecipeList.jsx';

import '../sass/styles.scss';

var User = require('./components/User.jsx'),
	user = new User();

user.getInfo(function (info) {

	window.user = info;

	class Index extends React.Component {
		render() {
			return <Wrapper>
				<Navigation />
				<Body>
				</Body>
			</Wrapper>
		}
	}

	render(<Index />, document.getElementById('app'));
});