var projectModel = require('../models/project.model.js');
var problemRequestModel = require('../models/problemrequest.model.js');
var common = require('./common.functions');

const NOT_AUTHORIZED = 'Not authorized.';

// Get all Problem Requests
exports.allEntries = function(req, res) {
	if (req.session && req.session.user) {
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
	} else {	
		common.errHandler(res, null, NOT_AUTHORIZED);
	}
}

// Get Problem Request by ID
exports.getDocumentById = function(req, res) {
	if (req.session && req.session.user) {
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
	} else {	
		common.errHandler(res, null, NOT_AUTHORIZED);
	}
}

// Create Problem Request
exports.newDocument = function(req, res) {
	if (req.session && req.session.user) {
		var problem = new problemRequestModel({
			problemNumber: common.generateId(),
			status: req.body.status,
			approvals: req.body.approvals,
			problemSummary: req.body.problemSummary,
			reportedBy: req.body.reportedBy,
			dateReported: req.body.dateReported,
			targetFixDate: req.body.targetFixDate,
			detailedDescription: req.body.detailedDescription,
			assignedSupport: req.body.assignedSupport,
			problemType: req.body.problemType,
			anlaysis: req.body.anlaysis,
			action: req.body.action,
			project: req.body.project
		});

		problem.save(function(err){
			if(err) {
				common.errHandler(res, err);
			} else {
				projectModel.findOne({_id: req.body.project})
					.select('problemRequests')
					.exec(function(err, data){
						if (err) {
							common.errHandler(res, err);
						} else {
							if (data) {
								data.problemRequests.push(problem._id);

								data.save(function(err){
									if (err){
										common.errHandler(res, err);
									} else {
										res.json({
											err: null,
											message: 'New record successfully created.'
										});													
									}
								});								
							} else {
								common.errHandler(res, null, 'Project not found.');	
							}
						}
					});
			}
		});
	} else {	
		common.errHandler(res, null, NOT_AUTHORIZED);
	}
}

// Update Problem Request by Id
exports.updateDocumentById = function(req, res) {
	if (req.session && req.session.user) {
		problemRequestModel.findOne({_id: req.params.id}, function(err, data){
			if (err) {
				common.errHandler(res, err);				
			} else {
				data.status = req.body.status;
				data.approvals = req.body.approvals;
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
	} else {	
		common.errHandler(res, null, NOT_AUTHORIZED);
	}
}

// Delete Document
exports.remove = function(req, res) {
	if (req.session && req.session.user) {
		common.removeDocument(req, res, problemRequestModel, function( projectId ){
			projectModel.findOne({_id: projectId})
				.select('problemRequests')
				.exec(function(err, data){
					if (err) {
						common.errHandler(res, err);
					} else {
						if (data) {
							data.problemRequests.pop(projectId);
							data.save(function(err){
								if (err) {
									common.errHandler(res, err);
								} else {
									res.json({
										err: null,
										message: 'Document successfully deleted.'
									});									
								}
							});
						} else {
							common.errHandler(res, null, 'Project not found.');
						}
					}
			});
		});
	} else {
		common.errHandler(res, null, NOT_AUTHORIZED);
	}
}