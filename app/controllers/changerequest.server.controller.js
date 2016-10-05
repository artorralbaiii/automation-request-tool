'use strict'

var changeRequestModel = require('../models/changerequest.model');
var configuration = require('../../configuration');

// Get all Change Requests
exports.AllEntries = function(req, res) {
	if (req.session && req.session.user) {	
		changeRequestModel.find({}, function(err, data){
			if (err) {
				res.json({
					err: err.message
				});
			} 

			res.json({
				err: null,
				data: data
			})
		})
	}
}

// Get Change Request by ID
exports.getDocumentById = function(req, res) {
	if (req.session && req.session.user) {
		changeRequestModel.findOne({_id: req.params.id}, function(err, data){
			if (err) {
				res.json({
					err: err.message
				});
			}

			res.json({
				err: null,
				data: data
			});
		})
	}
}

// Create New Change Request
exports.newDocument = function(req, res){
	if (req.session && req.session.user) {
		var changeRequest = new changeRequestModel({
			changeNumber: configuration.generateid(),
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
			comments: req.body.comments
		});

		changeRequest.save(function(err){
			if (err) {
				res.json({
					err: err.message
				})
			}

			res.json({
				err: null,
				message: 'Change Request successfully created.'
			})
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
		changeRequestModel.findOne(_id: req.params.id, function(err, data){

			if (err) {
				res.json({
					err: err.message
				});
			}

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

			data.save(function(err){
				if (err) {
					res.json({
						err: err.message
					});
				}

				res.json({
					err: null
				});
			});

		});
	} else {
		res.json({
			err: 'Not authorized.'
		});
	}
}