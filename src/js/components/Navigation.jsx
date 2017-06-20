import Site from '../Site.js';
import React from 'react';
import {render} from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';

var randomString = require('random-string');

const Navbar = ReactBootstrap.Navbar,
	Nav = ReactBootstrap.Nav,
	NavItem = ReactBootstrap.NavItem,
	NavDropdown = ReactBootstrap.NavDropdown,
	MenuItem = ReactBootstrap.MenuItem,
	FormControl = ReactBootstrap.FormControl;

const site = new Site();

var rand = randomString({ length: 20 }),
	url = "http://www.reddit.com/api/v1/authorize?client_id=va8Z5cSauGnlGQ&response_type=code&state=" + rand + "&redirect_uri=http://45.79.78.240/get-token/&duration=permanent&scope=identity";

function handleSelect(selectedKey) {
	if (selectedKey === 'loginToReddit') {
		window.location.href = url;
	} else if (selectedKey.substr(0, 1) === '/') {
		window.location.href = selectedKey;
	}
}

class Navigation extends React.Component {
	render() {

		if (window.user === false) {
			var right = <Nav onSelect={handleSelect} pullRight>
				<NavItem eventKey={'loginToReddit'} href={url}>Login</NavItem>
			</Nav>;
		} else {
			var right = <Nav onSelect={handleSelect} pullRight>
				<NavItem eventKey={'/upload'} href="/upload">Upload Recipe</NavItem>
				<NavItem eventKey={'/profile'} href="/profile">{window.user.name}</NavItem>
			</Nav>
		}

		return <Navbar collapseOnSelect>
			<Navbar.Header>
				<Navbar.Brand>
					<a href="/">{site.name}</a>
				</Navbar.Brand>
				<Navbar.Toggle />
			</Navbar.Header>
			<Navbar.Collapse>
				<Nav onSelect={handleSelect}>
					<NavItem eventKey={'/recipes'} href="/recipes">Recipes</NavItem>
				</Nav>
				{right}
			</Navbar.Collapse>
		</Navbar>;
	}
}

module.exports = Navigation;