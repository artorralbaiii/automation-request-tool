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
		.populate('requestedBy tester project approvals.BusinessOwner.approver ' +
				  'approvals.TechnicalLead.approver approvals.ServiceLine.approver')
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
		.populate('requestedBy tester project approvals.BusinessOwner.approver ' +
				  'approvals.TechnicalLead.approver approvals.ServiceLine.approver')
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
	changeRequest.requestedBy= req.session.user;
	changeRequest.dateRequested= req.body.dateRequested;
	changeRequest.targetDeployment= req.body.targetDeployment;
	changeRequest.detailedDescription= req.body.detailedDescription;
	changeRequest.tester= req.body.tester;
	changeRequest.project= req.body.project;
	changeRequest.approvals['BusinessOwner'].approver = req.body.businessOwner;
	changeRequest.approvals['TechnicalLead'].approver = req.body.technicalLead;
	changeRequest.approvals['ServiceLine'].approver = req.body.serviceLine;
	changeRequest.developers = req.body.developers;
	changeRequest.uatResult = req.body.uatResult;
	changeRequest.comments = req.body.comments;

	changeRequestWorkflow(changeRequest, function(changeRequest){
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


						if (data) {
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
						} else {
							common.errHandler(res, null, 'Project not found.', 409);
						}

					}
			});
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
		data.requestSummary= req.body.requestSummary;
		data.targetDeployment= req.body.targetDeployment;
		data.detailedDescription= req.body.detailedDescription;
		data.tester= req.body.tester;
		data.comments= req.body.comments;
		data.uatResult = req.body.uatResult;

		changeRequestWorkflow(data, function(data){
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

		if (req.params.status === 'Completed') {
			data.uatCompletionDate = new Date();
			data.uatResult = req.body.uatResult;
		}

		changeRequestWorkflow(data, function(data){
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
		
	});
}

exports.approval = function(req, res) {
	changeRequestModel.findOne({_id: req.params.id}, function(err, data){

		if (err) {
			common.errHandler(res, err);
			return;
		}

		data.previousStatus = data.status;
		data.approvals[req.body.action].status = 'Approved';
		data.approvals[req.body.action].dateAction = new Date();
		data.approvals[req.body.action].comments = req.body.comments;

		if (req.body.action === 'ServiceLine') {
			data.status = 'Ongoing'
		}

		changeRequestWorkflow(data, function(data){		
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

	});
}


var changeRequestWorkflow = function(data, callback){

	switch (data.status) {

		case 'Draft': {

			if (data.previousStatus === 'Request Assessment') {
				data.processOwner = data.requestedBy;
				data.availableAction = ['edit', 'save', 'submit'];
				
				if (data.approvals.BusinessOwner.status === 'Approved') {
					data.approvals.BusinessOwner.status = 'Pending';
					data.approvals.BusinessOwner.dateAction = '';
				}

				if (data.approvals.TechnicalLead.status === 'Approved') {
					data.approvals.TechnicalLead.status = 'Pending';
					data.approvals.TechnicalLead.dateAction = '';
				}
			} else {
				data.processOwner = data.requestedBy;
				data.availableAction = ['edit', 'save', 'submit'];
			}

			break;
		}

		case 'Requesting Additional Information': {

			if (data.previousStatus === 'Request Assessment') {
				data.processOwner = data.requestedBy;
				data.availableAction = ['edit', 'save', 'submit'];
				
				if (data.approvals.BusinessOwner.status === 'Approved') {
					data.approvals.BusinessOwner.status = 'Pending';
					data.approvals.BusinessOwner.dateAction = '';
				}

				if (data.approvals.TechnicalLead.status === 'Approved') {
					data.approvals.TechnicalLead.status = 'Pending';
					data.approvals.TechnicalLead.dateAction = '';
				}
			} else {
				data.processOwner = data.requestedBy;
				data.availableAction = ['edit', 'save', 'submit'];
			}

			break;
		}

		case 'Request Assessment': {
			data.availableAction = ['approve', 'return_for_revision'];

			if (data.approvals.BusinessOwner.status !== 'Approved') {
				if (data.approvals.BusinessOwner.approver.indexOf(data.requestedBy) >= 0 ) {
					data.approvals.BusinessOwner.status = 'Approved';
					data.approvals.BusinessOwner.dateAction = new Date();
					data.processOwner = data.approvals.TechnicalLead.approver;

				} else {
					data.processOwner = data.approvals.BusinessOwner.approver;				
				}		
			} else if (data.approvals.TechnicalLead.status !== 'Approved') {
					data.processOwner = data.approvals.TechnicalLead.approver;				
			} else if (data.approvals.ServiceLine.status !== 'Approved') {
					data.processOwner = data.approvals.ServiceLine.approver;				
			}

			break;

		}

		case 'Ongoing': {
			data.availableAction = ['proceed_to_uat'];
			data.processOwner = data.developers;
			break;
		}

		case 'UAT': {
			data.availableAction = ['proceed_for_deployment', 'return_to_developer'];
			data.processOwner = data.tester;
			break;
		}

		case 'Completed': {
			data.processOwner = data.developers;
			break;
		}

	}

	callback(data);
}



