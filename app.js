var mysqlpass = (process.argv[3] === undefined) ? false : process.argv[3];

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const request = require('request');
const base64 = require('base-64');
const session = require('client-sessions');
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(session({
  cookieName: 'session',
  secret: 'bob saget thug life',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: false
}));

app.get('/', function (req, res) {
	fs.readFile('src/public/static/index.html', function (err, content) {
		res.send(content.toString());
	});
});

app.get('/upload', function (req, res) {
	fs.readFile('src/public/static/upload.html', function (err, content) {
		res.send(content.toString());
	});
});

app.post('/save', function (req, res) {
//	console.log(req.body);
	var data = req.body;
	if (data.username === undefined ||
			data.username.length === 0) {
		res.send({
			'error': {
				'message': 'You need to log in',
				'element': 'container'
			}
		});
		return false;
	}
	if (req.session.info === undefined) {
		res.send({
			'error': {
				'message': 'You need to log in',
				'element': 'container'
			}
		});
		return false;
	}
	if (req.session.info.name !== data.username) {
		res.send({
			'error': {
				'message': 'Don\'t play with me, boy',
				'element': 'container'
			}
		});
		return false;
	}
	if (data.recipe.length === 0) {
		res.send({
			'error': {
				'message': 'You need a recipe title',
				'element': 'recipe'
			}
		});
		return false;
	}
	if (data.time.length === 0) {
		res.send({
			'error': {
				'message': 'You need to set how long this recipe takes to make',
				'element': 'time'
			}
		});
		return false;
	}
	if (data.servings.length === 0) {
		res.send({
			'error': {
				'message': 'You need to set how many servings this recipe makes',
				'element': 'servings'
			}
		});
		return false;
	}
	if (data.ingredients.length === 0) {
		res.send({
			'error': {
				'message': 'You need to set ingredients',
				'element': 'ingredients'
			}
		});
		return false;
	}
	if (data.ingredients[0].value === '') {
		res.send({
			'error': {
				'message': 'You need to set ingredients',
				'element': 'ingredients'
			}
		});
		return false;
	}
	if (data.directions.length === 0) {
		res.send({
			'error': {
				'message': 'You need to set directions',
				'element': 'directions'
			}
		});
		return false;
	}
	if (data.directions[0].value === '') {
		res.send({
			'error': {
				'message': 'You need to set directions',
				'element': 'directions'
			}
		});
		return false;
	}

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'frugal_user',
		pass: mysqlpass,
		database: 'frugal'
	});

	connection.connect();

	connection.query('INSERT INTO recipes (user, title, time, servings, datestamp) VALUES (? ?, ?, ?, UNIX_TIMESTAMP())', [req.session.info.name, data.recipe, data.time, data.servings], function (error, results, rows) {
		if (error) {
			throw error;
		}
		var id = results.insertId,
			a,
			b;
		for (a = 0; a < data.ingredients.length; a += 1) {
			connection.query("INSERT INTO ingredients (ord, recipe_id, content, datestamp) VALUES (?, ?, ?, UNIX_TIMESTAMP())", [a, id, data.ingredients[a].value]);
		}
		for (b = 0; b < data.directions.length; b += 1) {
			connection.query("INSERT INTO directions (ord, recipe_id, content, datestamp) VALUES (?, ?, ?, UNIX_TIMESTAMP())", [b, id, data.directions[b].value]);
		}

		res.send({
			'success': id
		});
	});

});

app.get('/me', function (req, res) {
	if (req.session === undefined ||
			req.session.info === undefined) {
		res.send('false');
		return false;
	}
	res.send(req.session.info);
	return true;
});

app.get('/get-token/', function (req, res) {
	const getData = querystring.parse(req.originalUrl.replace('/get-token/?', ''));
	if (getData.state !== undefined &&
			getData.code !== undefined) {
		request.post({
			url: "https://www.reddit.com/api/v1/access_token",
			form: {
				'grant_type': 'authorization_code',
				'code': getData.code,
				'redirect_uri': 'http://45.79.78.240/get-token/'
			},
			headers: {
				'Authorization': 'Basic ' + base64.encode('va8Z5cSauGnlGQ:Q2Rrw0FlP4eWjikWN9-JosEjguI'),
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		}, function optionalCallback(err, httpResponse, body) {
			body = JSON.parse(body);
			if (body.access_token !== undefined) {
				req.session.token = body.access_token;
				request.get({
					url: "https://oauth.reddit.com/api/v1/me",
					headers: {
						'User-Agent': 'webapp:45.79.78.240:0.5 (by /u/mcfailure)',
						'Authorization': 'bearer ' + body.access_token
					}
				}, function optionalCallback(err, httpResponse, body) {
					req.session.info = JSON.parse(body);
					res.redirect('/');
				});
			}
		});
	} else {
		console.log(getData.error);
	}
});

app.use('/js', express.static(path.resolve(__dirname, 'src/public/js')));
app.use('/css', express.static(path.resolve(__dirname, 'src/public/css')));
app.use('/fonts', express.static(path.resolve(__dirname, 'src/public/fonts')));

if (process.argv[2] !== undefined) {
	var port = process.argv[2];
} else {
	var port = 3000;
}

app.listen(port, function () {
	console.log('listening on port ' + port);
});