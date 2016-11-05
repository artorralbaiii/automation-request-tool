'use strict'

var projectModel = require('../models/project.model.js');
var common = require('./common.functions');

// Get all projects
exports.allEntries = function(req, res) {
	projectModel.find({})
		.populate('requester developers businessOwners supports changeRequests problemRequests')
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

// All Entries Lite
exports.allEntriesLite = function(req, res) {
	projectModel.find({})
		.select(req.params.cols)
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

	var search = req.params.search.replace('search:', '');
	var pattern;
	var searchOption = {};

	if (search !== '') {
		pattern =  new RegExp(search + '*', 'i'); 
		searchOption = {
			applicationName: pattern
		};
	}

	projectModel.find(searchOption)
		.sort('applicationName')
		.skip(parseInt(req.params.offset))
		.limit(parseInt(req.params.limit))
		.populate('requester developers businessOwners supports changeRequests problemRequests')
		.exec(function(err, data){

			if (err) {
				common.errHandler(res, err);
				return;
			}


			projectModel.count(function(err, count){
				if(err){
					common.errHandler(res, err);
					return;
				}

				var result = {};

				result.count = count;
				result.data = data;

				res.json({
					err: null,
					projects: result
				});

			});
	});	
}

// Get Project By ID
exports.getDocumentById = function(req, res) {
	projectModel.findOne({_id: req.params.id})
		.populate('requester developers businessOwners supports changeRequests problemRequests')
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
		applicationName: req.body.applicationName,
		isDeployed: req.body.isDeployed,
		requester: req.session.user,
		developers: req.body.developers,
		description: req.body.description,
		version: req.body.version,
		businessOwners: req.body.businessOwners,
		supports: req.body.supports,
		modifiedBy: req.session.user,
		serverName: req.body.serverName,
		filePath: req.body.filePath
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
		data.businessOwners = req.body.businessOwners;
		data.supports = req.body.supports;
		data.description = req.body.description;
		data.applicationName = req.body.applicationName;
		data.serverName = req.body.serverName;
		data.filePath = req.body.filePath;

		data.save(function(err) {
			if (err) {
				common.errHandler(res, err);
				return;
			}

			res.json({
				err: null,
				message: 'Record successfully updated.'
			});
		});
	});
}

// Delete Project
exports.remove = function(req, res) {
	common.removeDocument(req, res, projectModel);
}

