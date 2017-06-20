const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const request = require('request');
const base64 = require('base-64');
const session = require('client-sessions');
const mysql = require('mysql');

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
	res.send('test');
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