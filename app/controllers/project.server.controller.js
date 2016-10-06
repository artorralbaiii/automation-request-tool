var projectModel = require('../models/project.model.js');
var configuration = require('../../configuration');
// Get all projects

exports.allEntries = function(req, res) {
	if (req.session && req.session.user) {	
		projectModel.find({})
			.populate('requester developers businessOwner supports changeRequests problemRequests')
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
			err: 'Not authorized!'
		});
	}
}

// Get Project By ID
exports.getDocumentById = function(req, res) {
	if (req.session && req.session.user) {
		projectModel.findOne({_id: req.params.id})
			.populate('requester developers businessOwner supports changeRequests problemRequests')
		    .exec(function(err, data){
				if (err) {
					res.json({
						err: err.message
					});
				} else {
					res.json({
						err: null,
						data: data
					})
				}
		});
	} else {
		res.json({
			err: 'Not authorized!'
		});
	}
}


// Create new project
exports.newDocument = function(req, res) {
	if (req.session && req.session.user) {
		
		var project = new projectModel({
			projectId: configuration.generateId(),
			isDeployed: req.body.isDeployed,
			requester: req.body.requester,
			developers: req.body.developers,
			description: req.body.description,
			version: req.body.version,
			businessOwner: req.body.businessOwner,
			supports: req.body.supports
		});

		project.save(function(err){
			if (err) {
				res.json({
					err: err.message
				});
			} else {
				res.json({
					err: null,
					message: 'New project is created.'
				});
			}
		});		
	} else {
		res.json({
			err: 'Not authorized!'
		});
	}
}

// Update Project By Id
exports.updateDocumentById = function(req, res) {
	if (req.session && req.session.user) {
		projectModel.findOne({_id: req.params.id}, function(err, data){
			if (err) {
				res.json({
					err: err.message
				});
			} else {
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
			}
		});
	} else {
		res.json({
			err: 'Not authorized!'
		});
	}
}



