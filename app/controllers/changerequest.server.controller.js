'use strict'

var changeRequestModel = require('../models/changerequest.model');
var projectModel = require('../models/project.model.js');
var configuration = require('../../configuration');

// Get all Change Requests
exports.allEntries = function(req, res) {
	if (req.session && req.session.user) {	
		changeRequestModel.find({})
			.populate('requestedBy tester project approvals.approver')
			.exec(function(err, data){
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

// Get Change Request by ID
exports.getDocumentById = function(req, res) {
	if (req.session && req.session.user) {
		changeRequestModel.findOne({_id: req.params.id})
			.populate('requestedBy tester project approvals.approver')
			.exec(function(err, data){
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
		})
	} else {
		res.json({
			err: 'Not authorized.'
		});
	}
}

// Create New Change Request
exports.newDocument = function(req, res){
	if (req.session && req.session.user) {
		var changeRequest = new changeRequestModel({
			changeNumber: configuration.generateId(),
			status: req.body.status,
			approvals: req.body.approvals,
			requestSummary: req.body.requestSummary,
			requestedBy: req.body.requestedBy,
			dateRequested: req.body.dateRequested,
			targetDeployment: req.body.targetDeployment,
			detailedDescription: req.body.detailedDescription,
			tester: req.body.tester,
			uatResult: req.body.uatResult,
			uatCompletionDate: req.body.uatCompletionDate,
			comments: req.body.comments,
			project: req.body.project
		});

		changeRequest.save(function(err){
			if (err) {
				res.json({
					err: err.message
				})
			} else {			
				projectModel.findOne({_id: req.body.project})
					.select('changeRequests')
					.exec(function(err, data){

						if (err) {
							res.json({
								err: err.message
							});
						} else {

							data.changeRequests.push(changeRequest._id);
							
							data.save(function(err){
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
						}
					});
			}
		});													
	} else {
		res.json({
			err: 'Not authorized.'
		});		
	} 
}


// Update Change Request by Id
exports.updateDocumentById = function(req, res) {
	if (req.session && req.session.user) {
		changeRequestModel.findOne({_id: req.params.id}, function(err, data){

			if (err) {
				res.json({
					err: err.message
				});
			} else {			
				data.status= req.body.status;
				data.approvals= req.body.approvals;
				data.requestSummary= req.body.requestSummary;
				data.requestedBy= req.body.requestedBy;
				data.dateRequested= req.body.dateRequested;
				data.targetDeployment= req.body.targetDeployment;
				data.detailedDescription= req.body.detailedDescription;
				data.tester= req.body.tester;
				data.uatResult= req.body.uatResult;
				data.uatCompletionDate= req.body.uatCompletionDate;
				data.comments= req.body.comments;
				data.project= req.body.project;

				data.save(function(err){
					if (err) {
						res.json({
							err: err.message
						});
					}

					res.json({
						err: null,
						message: 'Record successfully updated.'
					});
				});
			}
		});
	}  else {	
		res.json({
			err: 'Not authorized.'
		});
	}
}