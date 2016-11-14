'use strict'

var _ = require('underscore');
var userModel = require('../models/user.model.js');
var problemRequestModel = require('../models/problemrequest.model');
var changeRequestModel = require('../models/changerequest.model');
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
				users: result
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

// Get user by key
exports.getDocumentByKey = function(req, res) {
	var pattern =  new RegExp(req.params.qry+'*', 'i'); 

	userModel.find({fullname: pattern})
	.select('_id fullname email')
	.limit(5)
	.exec(function(err, data){
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
		password: req.body.email,
		admin: req.body.admin
	});

	user.save(function(err, data){
		if (err) {
			common.errHandler(res, err);
			return;
		} 

		res.json({
			err: null,
			message: 'New record successfully created.',
			data: data
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
				message: 'Record successfully updated.',
				data: data
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
		
		try {
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
		} catch(err) {
			common.errHandler(res, err);			
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


exports.logout = function(req, res) {

	req.session.destroy(function(err){
		if (err) {
			res.json({
				err: err.message
			});

			return;
		}

		res.json({
			err: null,
			message: 'Logged out.'
		});

	});

}

exports.getMyRequests = function(req, res) {
	var requests = {};

	problemRequestModel
	.find({reportedBy: req.session.user})
	.select('_id problemNumber status problemSummary project')
	.exec(function(err, data){

		if (!err) {
			requests.myRequests = _.map(data, function(obj){
				return {
					_id: obj._id,
					resource: 'problem',
					description: obj.problemSummary,
					status: obj.status,
					id: obj.problemNumber,
					parentId: obj.project 				
				}
			});
		}


		getMyChanges(req.session.user, requests, function(requests){
			getMyRespProblem(req.session.user, requests, function(requests){
				getMyRespChange(req.session.user, requests, function(requests){

					res.json({
						err: null,
						data: requests
					});

				})
			})
		})
	});

}

function getMyChanges(id, requests, callback) {

	changeRequestModel
	.find({requestedBy: id})
	.select('_id changeNumber status requestSummary project')
	.exec(function(err, data){

		var myRequests = [];

		if (!err) {
			myRequests = _.map(data, function(obj){
				return {
					_id: obj._id,
					resource: 'change',
					description: obj.requestSummary,
					status: obj.status,
					id: obj.changeNumber,
					parentId: obj.project 				
				}
			});
		}

		requests.myRequests = _.union(requests.myRequests, myRequests);

		callback(requests)

	});

}

function getMyRespProblem(id, requests, callback) {

	problemRequestModel
	.find({assignedSupport: id, status : {$ne: 'Closed'} })
	.select('_id problemNumber status problemSummary project')
	.exec(function(err, data){

		if(!err) {
			requests.pendingActions = _.map(data, function(obj){
				return {
					_id: obj._id,
					resource: 'problem',
					description: obj.problemSummary,
					status: obj.status,
					id: obj.problemNumber,				
					parentId: obj.project
				}
			});			
		}

		callback(requests);

	});
}

function getMyRespChange(id, requests, callback) {

	var myRequests = [];

	changeRequestModel
	.find({processOwner: id, status : {$ne: 'Completed'}, status : {$ne: 'Draft'} })
	.select('_id changeNumber status requestSummary project')
	.exec(function(err, data){

		if (!err) {
			myRequests = _.map(data, function(obj){
				return {
					_id: obj._id,
					resource: 'change',
					description: obj.requestSummary,
					status: obj.status,
					id: obj.changeNumber,
					parentId: obj.project 				
				}
			});
		}

		requests.pendingActions = _.union(requests.pendingActions, myRequests);
		callback(requests);

	});
}


exports.getMyProblems = function(req, res, next) {

	var requests = {};

	problemRequestModel
	.find({reportedBy: req.session.user})
	.select('_id problemNumber status problemSummary project')
	.exec(function(err, data){

		if (err) {
			next(req, res, requests);
			return;
		}

		requests.myRequests = _.map(data, function(obj){
			return {
				_id: obj._id,
				resource: 'problem',
				description: obj.problemSummary,
				status: obj.status,
				id: obj.problemNumber,
				parentId: obj.project 				
			}
		});

		next(req, res, requests);


	});

}
