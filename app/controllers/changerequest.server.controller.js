'use strict'

var changeRequestModel = require('../models/changerequest.model');
var projectModel = require('../models/project.model.js');
var common = require('./common.functions');

// Get all Change Requests
exports.allEntries = function(req, res) {
	changeRequestModel.find({})
		.populate('requestedBy tester project approvals.approver')
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
	changeRequestModel.find({})
		.skip(parseInt(req.params.offset))
		.limit(parseInt(req.params.limit))
		.populate('requestedBy tester project approvals.approver')
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

// Get Change Request by ID
exports.getDocumentById = function(req, res) {
	changeRequestModel.findOne({_id: req.params.id})
		.populate('requestedBy tester project approvals.approver')
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

// Create New Change Request
exports.newDocument = function(req, res){
	var changeRequest = new changeRequestModel();

	changeRequest.changeNumber= common.generateId('CR');
	changeRequest.status= req.body.status;
	changeRequest.requestSummary= req.body.requestSummary;
	changeRequest.requestedBy= req.body.requestedBy;
	changeRequest.dateRequested= req.body.dateRequested;
	changeRequest.targetDeployment= req.body.targetDeployment;
	changeRequest.detailedDescription= req.body.detailedDescription;
	changeRequest.tester= req.body.tester;
	changeRequest.project= req.body.project;
	changeRequest.approvals['Business Owner'].approver = req.body.businessOwner;
	changeRequest.approvals['Technical Lead'].approver = req.body.technicalLead;
	changeRequest.approvals['Service Line'].approver = req.body.serviceLine;

	if (req.body.status === 'Request Assessment' &&
		req.body.requestedBy === req.body.businessOwner ) {
		changeRequest.approvals['Business Owner'].status = 'Approved';
		changeRequest.approvals['Business Owner'].dateAction = Date.now;
	}

	changeRequest.save(function(err){
		if (err) {
			common.errHandler(res, err);
			return;
		} 			
		
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
	});													
}

// Update Change Request by Id
exports.updateDocumentById = function(req, res) {
	changeRequestModel.findOne({_id: req.params.id}, function(err, data){

		if (err) {
			common.errHandler(res, err);
			return;
		} 			
		
		data.previousStatus= data.status;
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

// Delete Change Request
exports.remove = function(req, res) {
	common.removeDocument(req, res, changeRequestModel, function(projectId){
		projectModel.findOne({_id: projectId})
			.select('changeRequests')
			.exec(function(err, data){
				if (err) {
					common.errHandler(res, err);
					return;
				} 
				
				if (data) {
					data.changeRequests.pop(projectId);
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

//  Update status
exports.changeStatus = function(req, res) {
	changeRequestModel.findOne({_id: req.params.id}, function(err, data){
		if (err) {
			common.errHandler(res, err);
			return;
		}

		if (!data) {
			common.errHandler(res, null, 'Change request not found.', 409);
			return;
		} 

		data.previousStatus = data.status;
		data.status = req.params.status;
		data.approvals = req.body.approvals;

		if (req.params.status === 'Completed') {
			data.uatCompletionDate = Date.now;
			data.uatResult = req.body.uatResult;
			data.comments = req.body.comments;
		}
		
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

exports.approval = function(req, res) {
	changeRequestModel.findOne({_id: req.params.id}, function(err, data){

		if (err) {
			common.errHandler(res, err);
			return;
		}

		data.approvals[req.body.action].status = 'Approved';
		data.approvals[req.body.action].dateAction = Date.now;

		if (req.body.action === 'Service Line') {
			data.status = 'Ongoing'
		}

		data.save(function(err){
			if (err) {
				common.errHandler(res, err);
				return;
			}

			res.json({
				err: null,
				message: 'Approval saved.'
			});
		});
	});
}