var http = require('http');

var User = function () {}

User.prototype.getInfo = function(cb) {
	http.get('/me', function (res) {
		var str = '';
		res.on('data', function (chunk) {
			str += chunk;
		});
		res.on('end', function () {
			this.info = JSON.parse(str);
			if (cb !== undefined) {
				cb(this.info);
			}
		});
	});
}

module.exports = User;