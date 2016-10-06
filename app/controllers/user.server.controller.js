'use strict'

var userModel = require('../models/user.model.js');

// Get all users
exports.allEntries = function(req, res) {

	if (req.session && req.session.user) {
		userModel.find({}, function(err, data){
			if(err) {
				res.json({
					err: err.message
				});
				return;
			}  else {
				res.json({
					err: null,
					data: data
				});
			}
		});
	}  else {
		res.json({
			err: 'Not authorized.'
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
			err: 'Not authorized.'
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
					message: 'New record successfully created.'
				});
			}
		});
	} else {
		res.json({
			err: 'Not authorized.'
		});
	}
}

// Update User
exports.updateDocumentById = function(req, res) {
	if (req.session.user) {	
		userModel.findOne({_id: req.params.id}, function(err , data){
			if (err) {
				res.json({
					err: err.message
				});
			} else {			
				data.email = req.body.email;
				data.fullname = req.body.fullname;
				data.admin = req.body.admin;

				data.save(function(err){
					res.json({
						err: null,
						message: 'Record successfully updated.'
					});
				});
			} 
		});
	} else {	
		res.json({
			err: 'Not authorized.'
		});
	}
}


// Authentication
exports.login = function(req, res) {
	userModel.findOne({email: req.body.email}).select('password').exec(function(err, data){
		if (err) {
			res.json({
				err: err.message
			});
		} else {		
			if (data.comparePassword(req.body.password)) {
				req.session.regenerate(function(){
					req.session.user = data._id;
					res.json({
						err: null,
						message: 'Authenticated.'
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
