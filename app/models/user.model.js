"use strict";

var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
	email: {type: String, required: true, index: {unique: true}},
	fullname: {type: String, required: true},
	password: {type: String, default: 'password', select: false},
	admin: {type: Boolean, default: false}
}, { timestamps: true});

// Encrypt Password
userSchema.pre('save', function(next){
	var user = this;

	if (!user.isModified('password')) return next();

	bcrypt.hash(user.password, null, null, function(err, hash){
		if(err) return next(err);

		user.password = hash;
		next();
	});
});

userSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);