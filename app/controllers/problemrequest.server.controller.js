var problemRequestModel = require('../models/problemrequest.model.js');
var configuration = require('../../configuration');

// Get all Problem Requests
exports.allEntries = function(req, res) {
	if (req.session && req.session.user) {
		problemRequestModel.find({}, function(err, data){
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

// Get Problem Request by ID
exports.getDocumentById = function(req, res) {
	if (req.session && req.session.user) {
		problemRequestModel.findOne({_id: req.params.id}, function(err, data){
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


// Create Problem Request
exports.newDocument = function(req, res) {
	if (req.session && req.session.user) {
		var problem = new problemRequestModel({
			problemNumber: configuration.generateId(),
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
			project: req.body.projectid
		});

		problem.save(function(err){
			if(err) {
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
		res.json({
			err: 'Not authorized.'
		});
	}
}

// Update Problem Request by Id
exports.updateDocumentById = function(req, res) {
	if (req.session && req.session.user) {
		problemRequestModel.findOne({_id: req.params.id}, function(err, data){
			if (err) {
				res.json({
					err: err.message
				});
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
			}
		});
	} else {	
		res.json({
			err: 'Not authorized.'
		})
	}
}



