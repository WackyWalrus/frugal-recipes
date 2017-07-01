var http = require('http');

var User = function (name) {
	if (name !== undefined) {
		this.name = name;
	}
}

User.prototype.getInfo = function(cb) {
	http.get('/me', function (res) {
		var str = '';
		res.on('data', function (chunk) {
			str += chunk;
		});
		res.on('end', function () {
			this.info = JSON.parse(str);
			this.name = this.info.name;
			if (cb !== undefined) {
				cb(this.info);
			}
		});
	});
}

module.exports = User;