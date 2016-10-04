var userModel = require('../models/user.model.js');

// Get all users
exports.allEntries = function(req, res) {

	if (req.session && req.session.user) {
		userModel.find({}, function(err, data){
			if(err) {
				res.json({
					err: err.message
				});
			} else {
				res.json({
					err: null,
					data: data
				});
			}
		});
	} else {
		res.json({
			err: 'Not authorized!'
		});
	}
}

// Get user by id
exports.getDocumentById = function(req, res) {
	if (req.session.user) {
		userModel.find({_id: req.params.id}, function(err, data){
			if (err) {
				res.json({
					err: err.message
				});
			} else {
				res.json({
					err: null,
					data: data
				});
			}
		});
	} else {
		res.json({
			err: 'Not authorized!'
		});
	}
}

// Create New User
exports.newDocument = function(req, res) {
	if (req.session.user) {
		var user = new userModel({
			email: req.body.email,
			fullname: req.body.fullname,
			password: req.body.password,
			admin: req.body.admin
		});

		user.save(function(err){
			if (err) {
				res.json({
					err: err.message
				});
			} else {
				res.json({
					err: null,
					message: 'New user is created.'
				});
			}
		});
	} else {
		res.json({
			err: 'Not authorized!'
		});
	}
}

// Update User
exports.updateDocumentById = function(req, res) {
	if (req.session.user) {	
		userModel.findOne({_id: req.params.id}, function(err , doc){
			if (err) {
				res.json({
					err: err.message
				});
			} else {
				doc.email = req.body.email;
				doc.fullname = req.body.fullname;
				doc.admin = req.body.admin;

				doc.save(function(err){
					res.json({
						err: null,
						message: 'User successfully updated.'
					})
				});
			}
		});
	} else {
		res.json({
			err: 'Not authorized!'
		});
	}
}


// Authentication
exports.login = function(req, res) {
	userModel.findOne({email: req.body.email}).select('password').exec(function(err, doc){
		if (err) {
			res.json({
				err: err.message
			});
		} else {
					
			if (doc.comparePassword(req.body.password)) {
				req.session.regenerate(function(){
					req.session.user = doc._id;
					res.json({
						err: null
					});					
				});
			} else {
				res.json({
					err: true,
					message: 'Invalid password'					
				});
			}
		}
	});
}
