import React from 'react';
import {render} from 'react-dom';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import Wrapper from './components/Wrapper.jsx';
import Navigation from './components/Navigation.jsx';
import Body from './components/Body.jsx';
import RecipeList from './components/RecipeList.jsx';

import '../sass/styles.scss';

var Url = require('url');
var url = Url.parse(window.location.href);

var category = 0;
var query = '';

if (url.query !== null) {
	if (url.query.indexOf('category=') !== -1) {
		category = url.query.split('&');

		for (var i = 0; i < category.length; i += 1) {
			if (category[i].indexOf('category') !== -1) {
				category = category[i];
				break;
			}
		}

		category = parseInt(category.replace('category=', ''), 10);
	} else {
		category = 0;
	}

	if (url.query.indexOf('q=') !== -1) {
		var split = url.query.split('&');
		for (var i = 0; i < split.length; i += 1) {
			if (split[i].indexOf('q=') == 0) {
				query = split[i].replace('q=', '');
				break;
			}
		}
	}
} else {
	category = 0;
}

var User = require('./components/User.jsx'),
	user = new User();

user.getInfo(function (info) {

	window.user = info;

	class Index extends React.Component {
		render() {
			return <Wrapper>
				<Navigation />
				<Body sidebar category={category}>
					<RecipeList search query={query} category={category} />
				</Body>
			</Wrapper>
		}
	}

	render(<Index />, document.getElementById('app'));
});