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
const glob = require('glob');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(session({
  cookieName: 'session',
  secret: 'bob saget thug life',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: false
}));

/**
 * Homepage
 */
app.get('/', function (req, res) {
	/**
	 * Setup mysql connection
	 */
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'frugal_user',
		password: mysqlpass,
		database: 'frugal'
	});

	connection.connect();

	var query = "SELECT * FROM recipes WHERE 1";
	var variables = [];

	if (req.query !== undefined &&
			req.query.q !== undefined &&
			req.query.q.length !== 0) {
		query += " AND title LIKE ? ";
		variables.push("%" + req.query.q + "%");
	}

	if (req.query !== undefined &&
			req.query.category !== undefined &&
			req.query.category.length !== 0 &&
			parseInt(req.query.category, 10) !== 0) {
		query += " AND ? IN (SELECT category_id FROM selected_categories WHERE recipe_id = recipes.id) ";
		variables.push(req.query.category);
	}

	query += " ORDER BY id DESC LIMIT 10";

	/**
	 * Get recipes
	 */
	connection.query(query, variables, function (error, results, rows) {
		var data = results;

		/**
		 * Get html file
		 */
		fs.readFile('src/public/static/index.html', function (err, content) {
			var content = content.toString();
			/**
			 * Replace data
			 */
			if (data !== undefined &&
					data.length !== 0) {
				content = content.replace('{recipe-data}', JSON.stringify(data));
			}
			/**
			 * Serve file
			 */
			res.send(content.toString());
		});
	});

});

/**
 * Upload Recipe page
 */
app.get('/upload', function (req, res) {
	fs.readFile('src/public/static/upload.html', function (err, content) {
		res.send(content.toString());
	});
});

/**
 * Send recipe categories
 */
app.get('/categories', function (req, res) {
	/**
	 * Setup mysql connection
	 */
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'frugal_user',
		password: mysqlpass,
		database: 'frugal'
	});

	connection.connect();

	connection.query("SELECT * FROM categories ORDER BY title ASC", function (error, results, rows) {
		res.send(results);
		connection.end();
	});
});

app.get('/recipe/:recipeId', function (req, res) {
	fs.readFile('src/public/static/recipe.html', function (err, content) {
		var html = content.toString();

		var recipeId = parseInt(req.params.recipeId, 10);

		var data = {};

		/**
		 * Setup mysql connection
		 */
		var connection = mysql.createConnection({
			host: 'localhost',
			user: 'frugal_user',
			password: mysqlpass,
			database: 'frugal'
		});

		connection.connect();

		/**
		 * Get main recipe sql
		 */
		connection.query("SELECT * FROM recipes WHERE id = ? LIMIT 1", [recipeId], function (error, results, rows) {
			if (error) {
				throw error;
			}

			if (results.length === 0) {
				return false;
			}

			/**
			 * Setup data
			 */
			data.id = results[0].id;
			data.user = results[0].user;
			data.title = results[0].title;
			data.time = results[0].time;
			data.servings = results[0].servings;
			data.datestamp = results[0].datestamp;
			data.ingredients = [];
			data.directions = [];

			/**
			 * Get ingredients
			 */
			connection.query("SELECT * FROM ingredients WHERE recipe_id = ? ORDER BY ord ASC", [recipeId], function (error, results, rows) {
				/**
				 * Append ingredient data
				 */
				for (var i = 0; i < results.length; i += 1) {
					data.ingredients.push({
						'id': results[i].id,
						'ord': results[i].ord,
						'content': results[i].content
					});
				}
				/**
				 * Get directions
				 */
				connection.query("SELECT * FROM directions WHERE recipe_id = ? ORDER BY ord ASC", [recipeId], function (error, results, rows) {
					/**
					 * Append direction data
					 */
					for (var i = 0; i < results.length; i += 1) {
						data.directions.push({
							'id': results[i].id,
							'ord': results[i].ord,
							'content': results[i].content
						});
					}
					
					/**
					 * Find image file
					 */
					glob('src/public/images/' + data.id + '.*', function (er, files) {
						/**
						 * Append image file if there is one
						 */
						if (files[0] !== undefined) {
							data.imagesrc = files[0].replace('src/public', '');
						}

						/**
						 * Append data to html file
						 */
						var fixHTML = new Promise(function (resolve, reject) {
							if (html = html.replace('{pagedata}', JSON.stringify(data))) {
								resolve(html);
							}
						});

						fixHTML.then(function (result) {
							/**
							 * Serve html
							 */
							res.send(result);
							connection.end();
						});
					});
				});
			});


		});

	});
});

/**
 * Profile page
 */
app.get('/profile/:username', function (req, res) {
	var username = '';
	if (req.params.username !== undefined) {
		username = req.params.username;
	}

	if (username !== '') {
		/**
		 * Get html file
		 */
		fs.readFile('src/public/static/profile.html', function (err, content) {
			var content = content.toString();
			/**
			 * Serve file
			 */
			res.send(content.toString());
		});
	}
});

/**
 * Save recipe
 */
app.post('/save', function (req, res) {
	var data = req.body;
	/**
	 * Check if the data is good
	 */
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
	if (data.selectedCategories.length === 0) {
		res.send({
			'error': {
				'message': 'You need to choose at least one category',
				'element': 'categories'
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

	/**
	 * Fix some of the data
	 */
	if (data.ingredients[data.ingredients.length - 1].value.length === 0) {
		data.ingredients.splice(data.ingredients.length - 1, 1);
	}
	if (data.directions[data.directions.length - 1].value.length === 0) {
		data.directions.splice(data.directions.length - 1, 1);
	}

	/**
	 * Setup mysql connection
	 */
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'frugal_user',
		password: mysqlpass,
		database: 'frugal'
	});

	connection.connect();

	/**
	 * Insert recipes
	 */
	connection.query('INSERT INTO recipes (user, title, time, servings, datestamp) VALUES (?, ?, ?, ?, UNIX_TIMESTAMP())', [req.session.info.name, data.recipe, data.time, data.servings], function (error, results, rows) {
		if (error) {
			throw error;
		}
		var id = results.insertId,
			a,
			b,
			c;
		/**
		 * Insert ingredients and directions
		 */
		for (a = 0; a < data.ingredients.length; a += 1) {
			connection.query("INSERT INTO ingredients (ord, recipe_id, content, datestamp) VALUES (?, ?, ?, UNIX_TIMESTAMP())", [a, id, data.ingredients[a].value]);
		}
		for (b = 0; b < data.directions.length; b += 1) {
			connection.query("INSERT INTO directions (ord, recipe_id, content, datestamp) VALUES (?, ?, ?, UNIX_TIMESTAMP())", [b, id, data.directions[b].value]);
		}
		for (c = 0; c < data.selectedCategories.length; c += 1) {
			connection.query("INSERT INTO selected_categories (category_id, recipe_id, datestamp) VALUES (?, ?, UNIX_TIMESTAMP())", [data.selectedCategories[c], id]);
		}

		/**
		 * Upload image
		 */
		if (data.img !== undefined &&
				data.img.length !== 0) {
			var match = data.img.match(/^data:.+\/(.+);base64,(.*)$/i);
			if (match[1] === 'jpeg' ||
					match[1] === 'jpg' ||
					match[1] === 'png' ||
					match[1] === 'gif') {

				var buffer = new Buffer(match[2], 'base64');

				fs.writeFile('src/public/images/' + id + '.' + match[1], buffer, function (err) {
					if (err) {
						throw err;
					}
					console.log('file uploaded');
				});
			}
		}

		connection.end();

		res.send({
			'success': id
		});
	});

});

/**
 * This is an internal request for session info, only works for currently logged in user
 */
app.get('/me', function (req, res) {
	if (req.session === undefined ||
			req.session.info === undefined) {
		res.send('false');
		return false;
	}
	res.send(req.session.info);
	return true;
});

/**
 * Reddit oauth2 login code
 */
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
app.use('/images', express.static(path.resolve(__dirname, 'src/public/images')));

if (process.argv[2] !== undefined) {
	var port = process.argv[2];
} else {
	var port = 3000;
}

app.listen(port, function () {
	console.log('listening on port ' + port);
});