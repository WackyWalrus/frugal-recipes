import React from 'react';
import {render} from 'react-dom';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import Wrapper from './components/Wrapper.jsx';
import Navigation from './components/Navigation.jsx';
import Body from './components/Body.jsx';
import RecipeList from './components/RecipeList.jsx';
import Profile from './components/Profile.jsx';

import '../sass/styles.scss';

var User = require('./components/User.jsx'),
	user = new User();

var Url = require('url'),
	url = Url.parse(window.location.href);

user.getInfo(function (info) {

	window.user = info;

	class Index extends React.Component {
		constructor(props) {
			super(props);


			var u = url.pathname.replace('/profile/', '');

			if (u === '') {
				if (user.name !== undefined) {
					u = user.name;
				} else {
					return false;
				}
			}

			this.state = {
				user: u
			}
		}

		render() {
			return <Wrapper>
				<Navigation />
				<Body>
					<Profile user={this.state.user} />
				</Body>
			</Wrapper>
		}
	}

	render(<Index />, document.getElementById('app'));
});