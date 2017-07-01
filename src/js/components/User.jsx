var http = require('http');

var User = function (username) {
	if (username === undefined) {
		this.get = '/me';
	} else {
		this.get = '/me/' + username;
	}
}

User.prototype.getInfo = function(cb) {
	http.get(this.get, function (res) {
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