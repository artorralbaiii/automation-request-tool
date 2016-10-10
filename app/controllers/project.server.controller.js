'use strict'

var projectModel = require('../models/project.model.js');
var common = require('./common.functions');

// Get all projects
exports.allEntries = function(req, res) {
	projectModel.find({})
		.populate('requester developers businessOwner supports changeRequests problemRequests')
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

// Navigate Projects using paging.
exports.pageEntries = function(req, res) {
	projectModel.find({})
		.skip(parseInt(req.params.offset))
		.limit(parseInt(req.params.limit))
		.populate('requester developers businessOwner supports changeRequests problemRequests')
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

// Get Project By ID
exports.getDocumentById = function(req, res) {
	projectModel.findOne({_id: req.params.id})
		.populate('requester developers businessOwner supports changeRequests problemRequests')
	    .exec(function(err, data){
			if (err) {
				common.errHandler(res, err);
				return;
			} 
			
			res.json({
				err: null,
				data: data
			})
	});
}

// Create new project
exports.newDocument = function(req, res) {
	var project = new projectModel({
		projectId: common.generateId('PRJ'),
		isDeployed: req.body.isDeployed,
		requester: req.session.user,
		developers: req.body.developers,
		description: req.body.description,
		version: req.body.version,
		businessOwner: req.body.businessOwner,
		supports: req.body.supports
	});

	project.save(function(err){
		if (err) {
			common.errHandler(res, err);
			return;
		} 
		
		res.json({
			err: null,
			message: 'New project is created.'
		});
	});		
}

// Update Project By Id
exports.updateDocumentById = function(req, res) {
	projectModel.findOne({_id: req.params.id}, function(err, data){
		if (err) {
			common.errHandler(res, err);
			return;
		} 
		
		data.isDeployed = req.body.isDeployed;
		data.requester = req.body.requester;
		data.developers = req.body.developers;
		data.version = req.body.version;
		data.businessOwner = req.body.businessOwner;
		data.supports = req.body.supports;
		data.description = req.body.description,

		data.save(function(err) {
			if (err) {
				res.json({
					err: err.message
				});
			} else {
				res.json({
					err: null,
					message: 'Record successfully updated.'
				});
			}
		});
	});
}

// Delete Project
exports.remove = function(req, res) {
	common.removeDocument(req, res, projectModel);
}

