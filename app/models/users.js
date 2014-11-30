var mongoose = require('mongoose'),
	bcrypt   = require('bcrypt-nodejs'),
	utils = require('../utility');

var Schema   = mongoose.Schema;

var UserSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: String,
	date_modified: { type: Date, default: Date.now },
  	date_created: { type: Date, default: Date.now },
  	login_attempts: { type: Number, required: true, default: 0 },
  	lock_until: { type: Number }
});

UserSchema.statics.failedLogin = {
	NOT_FOUND: 0,
	PASSWORD_INCORRECT: 1,
	MAX_ATTEMPTS: 2
};

UserSchema.pre('save', function (next, done) {
	var user = this;
	
	user = utils.updateTimestamps(user);

	// Do nothing if password hasn't changed
	if (!user.isModified('password')) return next();

	// Password changed so we need to hash it
	user.generateHash(user.password, function (hash){
		user.password = hash;
		next();
	});
});

UserSchema.methods.generateHash = function (password, callback) {
	hash = bcrypt.hashSync(password);
	callback(hash);
};

UserSchema.methods.verifyPassword = function (password, callback) {
	bcrypt.compare(password, this.password, function(err, isMatch){
		callback(isMatch);
	});
};

module.exports = mongoose.model('User', UserSchema);