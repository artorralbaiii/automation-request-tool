'use strict'

var userModel = require('../models/user.model.js');
var common = require('./common.functions');

// Get all users
exports.allEntries = function(req, res) {
	userModel.find({}, function(err, data){
		if(err) {
			common.errHandler(res, err);
			return;
		} 

		res.json({
			err: null,
			data: data
		});		
	});
}

// Navigate Projects using paging.
exports.pageEntries = function(req, res) {
	userModel.find({})
		.skip(parseInt(req.params.offset))
		.limit(parseInt(req.params.limit))
		.exec(function(err, docs){

			if (err) {
				common.errHandler(res, err);
				return;
			}

			var result = {};

			result.count = docs.length;
			result.data = docs;

			res.json({
				err: null,
				data: result
			});
	});	
}

// Get user by id
exports.getDocumentById = function(req, res) {
	userModel.find({_id: req.params.id}, function(err, data){
		if (err) {
			common.errHandler(res, err);
			return;
		} 	
		
		res.json({
			err: null,
			data: data
		});
	});
}

// Create New User
exports.newDocument = function(req, res) {
	var user = new userModel({
		email: req.body.email,
		fullname: req.body.fullname,
		password: req.body.password,
		admin: req.body.admin
	});

	user.save(function(err){
		if (err) {
			common.errHandler(res, err);
			return;
		} 

		res.json({
			err: null,
			message: 'New record successfully created.'
		});
	});
}

// Update User
exports.updateDocumentById = function(req, res) {
	userModel.findOne({_id: req.params.id}, function(err , data){
		if (err) {
			common.errHandler(res, err);
			return;
		} 			
		 
		data.email = req.body.email;
		data.fullname = req.body.fullname;
		data.admin = req.body.admin;

		data.save(function(err){
			res.json({
				err: null,
				message: 'Record successfully updated.'
			});
		});
	});
}

// Authentication
exports.login = function(req, res) {
	userModel.findOne({email: req.body.email})
	.select('password admin fullname')
	.exec(function(err, data){
		if (err) {
			common.errHandler(res, err);
			return;
		}
	
		if (!data) {
			common.errHandler(res, null, 'Email is not registered.', 200);
			return;
		}

		if (data.comparePassword(req.body.password)) {
			req.session.regenerate(function(){
				req.session.user = data._id;
				req.session.fullname = data.fullname;
				req.session.admin = data.admin;

				res.json({
					err: null,
					message: 'Authenticated.'
				});					
			});
		} else {
			common.errHandler(res, null, 'Invalid password.', 200);
		}
	});
}

// Delete User
exports.remove = function(req, res) {
	common.removeDocument(req, res, userModel);
}

// Get Role
exports.getSession = function(req, res) {
	res.json({
		err: null,
		session: req.session
	});
}

exports.changePassword = function(req, res) {
	userModel.findOne({_id: req.params.id}, function(err, data){

		if (err) {
			common.errHandler(res, err);
			return;
		}

		data.password = req.body.password;

		data.save(function(err){
			if (err) {
				common.errHandler(res, err);
				return;
			}

			res.json({
				err: null,
				message: 'Password successfully changed.'
			});

		});
	});
}


