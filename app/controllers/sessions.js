var redis = require('redis');
var config = require('../config/config.js');

var redisClient = redis.createClient(config.jwt.port, config.jwt.host);

// Set static vars for jwt
var TOKEN_EXPIRATION = 60,
	TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;

// Middleware for token verification
exports.verifyToken = function(req, res, next) {
	var token = getToken(req.headers);

	redisClient.get(token, function (err, reply) {
		if (err) {
			console.log(err);
			return res.status(500).end();
		}
		if (reply) {
			res.status(401).end();
		} else {
			next();
		}
	});
};

exports.expireToken = function (headers) {
	var token = getToken(headers);

	if (token != null) {
		redisClient.set(token, { is_expired: true });
		redisClient.expire(token, TOKEN_EXPIRATION_SEC);
	}
};

var getToken = function (headers) {
	if (headers && headers.authorization) {
		var authorization = headers.authorization;
		var part = authorization.split();

		if (part.length == 2) {
			var token = part[1];
			return token;
		} else {
			return null;
		}
	} else {
		return null;
	}
};