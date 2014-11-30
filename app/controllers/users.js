var User = require('../models/users');
var utils = require('../utility');
var jwt = require('jsonwebtoken');
var sessionManager = require('../controllers/sessions');
var config = require('../config/config.js');

exports.login = function(req, res) {
	var username = req.body.username || '';
	var password = req.body.password || '';

	if (username === '' || password === ''){
		return res.status(401).end();
	}

	User.findOne( { username: username } , function (err, user){

		if (err) {
			return res.status(401).end();
		}

		if (user === undefined) {
			return res.status(401).end();
		}

		user.verifyPassword(password, function (isMatch) {

			if (!isMatch) {
				console.log('Failed login attempt: ' + user.username);
				return res.status(401).end();
			}
			
			var token = jwt.sign({ id: this._id },
				config.jwt.secret,
				{ expiresInMinutes: sessionManager.expiresInMinutes }
			);
			return res.json({ token : token });
		});
	});
};

exports.getUsers = function (req, res) {
	User.find(function(err, users){
		if (err) {
			return res.send(err);
		}
		res.json(users);
	});
};

// delete the user with this id (accessed at DELETE /api/users/:user_id)
exports.deleteUser = function (req, res) {
  User.remove({
    _id: req.params.user_id
  }, function (err, user) {
    if (err)
      res.send(err);

    res.json({ message: 'User ' + req.params.user_id + ' deleted' });
  });
};

exports.logout = function(req, res) {
	if (req.user) {
		sessionManager.expireToken(req.headers);

		delete req.user;
		return res.status(200).end();
	}
};

exports.register = function(req, res) {
	var username             = req.body.username || '';
	var password             = req.body.password || '';
	// var passwordConfirmation = req.body.passwordConfirmation || '';
	
	// if (username === '' || password === '' || password != passwordConfirmation){
	if (username === '' || password === ''){
		return res.send(400);
	}

	var user = new User();
	user = utils.updateModel(user, User, req.body);

	user.save(function (err) {
		console.log(user);
		if (err) {
			console.log(err);
			return res.status(500);
		}

		res.json({ message: 'User ' + user._id + ' created'});
	});
};