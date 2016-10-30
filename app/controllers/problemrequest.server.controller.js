'use strict'

var projectModel = require('../models/project.model');
var problemRequestModel = require('../models/problemrequest.model');
var userModel = require('../models/user.model');
var mailController = require('./mail.server.controller');
var common = require('./common.functions');

// Get all Problem Requests
exports.allEntries = function(req, res) {
	problemRequestModel.find({})
		.populate('reportedBy assignedSupport project approvals.approver')
		.exec(function(err, data){
			if (err) {
				common.errHandler(res, err);
			} else {			
				res.json({
					err: null,
					data: data
				});
			}
		});
}

// Navigate Projects using paging.
exports.pageEntries = function(req, res) {
	problemRequestModel.find({})
		.skip(parseInt(req.params.offset))
		.limit(parseInt(req.params.limit))
		.populate('reportedBy assignedSupport project approvals.approver')
		.exec(function(err, data){

			if (err) {
				common.errHandler(res, err);
				return;
			}

			var result = {};

			result.count = data.length;
			result.data = data;

			res.json({
				err: null,
				data: result
			});
	});	
}

// Get Problem Request by ID
exports.getDocumentById = function(req, res) {
	problemRequestModel.findOne({_id: req.params.id})
		.populate('reportedBy assignedSupport project approvals.approver')
		.exec( function(err, data){
			if (err) {
				common.errHandler(res, err);
			} else {			
				res.json({
					err: null,
					data: data
				});
			}
		});
}

// Create Problem Request
exports.newDocument = function(req, res) {
	var problem = new problemRequestModel({
		problemNumber: common.generateId('PR'),
		status: req.body.status,
		problemSummary: req.body.problemSummary,
		reportedBy: req.session.user,
		dateReported: req.body.dateReported,
		targetFixDate: req.body.targetFixDate,
		detailedDescription: req.body.detailedDescription,
		assignedSupport: req.body.assignedSupport,
		project: req.body.project
	});

	problem.save(function(err){
		if(err) {
			common.errHandler(res, err);
			return;
		}

		projectModel.findOne({_id: problem.project})
			.select('problemRequests')
			.exec(function(err, data){
				
				if (err) {
					common.errHandler(res, err);
					return;
				} 
				
				if (data) {
					data.problemRequests.push(problem.project);

					data.save(function(err){
						if (err){
							common.errHandler(res, err);
							return;
						}
															
						res.json({
							err: null,
							message: 'New record successfully created.'
						});													
					});								
				} else {
					common.errHandler(res, null, 'Project not found.');	
				}
			});
	});
}

// Update Problem Request by Id
exports.updateDocumentById = function(req, res) {
	problemRequestModel.findOne({_id: req.params.id}, function(err, data){
		if (err) {
			common.errHandler(res, err);				
		} else {

			data.previousStatus = data.status; 
			data.status = req.body.status;
			data.problemSummary = req.body.problemSummary;
			data.reportedBy = req.body.reportedBy;
			data.dateReported = req.body.dateReported;
			data.targetFixDate = req.body.targetFixDate;
			data.detailedDescription = req.body.detailedDescription;
			data.assignedSupport = req.body.assignedSupport;
			data.problemType = req.body.problemType;
			data.analysis = req.body.analysis;
			data.action = req.body.action;
			data.project = req.body.projectid;

			data.save(function(err) {
				if (err) {
					common.errHandler(res, err);
				} else {
					res.json({
						err: null,
						message: 'Record successfully updated.'
					});					
				}
			});
		}
	});
}

// Delete Document
exports.remove = function(req, res) {
	common.removeDocument(req, res, problemRequestModel, function( projectId ){
		projectModel.findOne({_id: projectId})
			.select('problemRequests')
			.exec(function(err, data){
				if (err) {
					common.errHandler(res, err);
					return;
				} 
				
				if (data) {
					data.problemRequests.pop(projectId);
					data.save(function(err){
						if (err) {
							common.errHandler(res, err);
							return;
						} 
						
						res.json({
							err: null,
							message: 'Document successfully deleted.'
						});									
					});
				} else {
					common.errHandler(res, null, 'Project not found.', 409);
				}
		});
	});
}

// Workflow
exports.changeStatus = function(req, res) {	
	problemRequestModel.findOne({_id: req.params.id}, function(err, data) {
		
		if (err) {
			common.errHandler(res, err);
			return;
		}

		if (!data) {
			common.errHandler(res, null, 'Problem request not found.', 409);
			return;
		}


		data.previousStatus = data.status;
		data.status = req.params.status;

		data.save(function(err){
			if (err) {
				common.errHandler(res, err);
				return;
			}

			res.json({
				err: null,
				message: 'Status successfully updated.' 
			});
		});
	});
}
