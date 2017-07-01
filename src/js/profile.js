import React from 'react';
import {render} from 'react-dom';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import Wrapper from './components/Wrapper.jsx';
import Navigation from './components/Navigation.jsx';
import Body from './components/Body.jsx';
import RecipeList from './components/RecipeList.jsx';
import Profile from './components/Profile.jsx';

import '../sass/styles.scss';

var User = require('./components/User.jsx');
var userData = document.getElementById('user-data').value;
var user;

if (userData === '{user-data}') {
	user = new User();
} else {
	var data = JSON.parse(userData);

	user = new User(data.name);
}



user.getInfo(function (info) {

	window.user = info;

	class Index extends React.Component {
		render() {
			return <Wrapper>
				<Navigation />
				<Body>
					<Profile user={user}/>
				</Body>
			</Wrapper>
		}
	}

	render(<Index />, document.getElementById('app'));
});