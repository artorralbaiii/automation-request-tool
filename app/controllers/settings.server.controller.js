var settingsModel = require('../models/settings.model');
var common = require('./common.functions');

exports.newDocument = function(req, res) {
	var settings = new settingsModel({
		technicalLeads: req.body.technicalLeads,
		serviceLineLeads: req.body.serviceLineLeads,
		developers: req.body.developers,
		supports: req.body.supports,
		noteApproval: req.body.noteApproval,
		noteToDeveloper: req.body.noteToDeveloper,
		noteReturnedToDeveloper: req.body.noteReturnedToDeveloper,
		noteToSupport: req.body.noteToSupport,
		noteToTester: req.body.noteToTester,
		noteApproved: req.body.noteApproved,
		noteRejected: req.body.noteRejected,
		noteCompleted: req.body.noteRejected,
		noteClosed: req.body.noteClosed
	});

	settings.save(function(err){
		if(err) {
			common.errHanlder(res, err);
			return;
		}

		res.json({
			err: null,
			message: 'New record successfully created.'
		});
	});
}

exports.getDocument = function(req, res){
	settingsModel.find({})
		.limit(1)
		.populate('technicalLeads serviceLineLeads developers supports', 'fullname email')
		.exec(function(err, data){
			if (err) {
				common.errHanlder(res, err);
				return;
			}

			if (data) {
				res.json({
					err: null,
					data: data[0]
				});
			} else {
				res.json({
					err: null,
					data: null
				});
			}
	});
}

exports.updateDocumentById = function(req, res) {
	settingsModel.findOne({_id: req.params.id}, function(err, data){
		if (err) {
			common.errHanlder(res, err);
			return;
		}

		if (!data) {
			data = new settingsModel();	
		}

		data.technicalLeads = req.body.technicalLeads;
		data.serviceLineLeads = req.body.serviceLineLeads;
		data.developers = req.body.developers;
		data.supports = req.body.supports;
		data.noteApproval = req.body.noteApproval;
		data.noteToDeveloper = req.body.noteToDeveloper;
		data.noteReturnedToDeveloper = req.body.noteReturnedToDeveloper;
		data.noteToSupport = req.body.noteToSupport;
		data.noteToTester = req.body.noteToTester;
		data.noteApproved = req.body.noteApproved;
		data.noteRejected = req.body.noteRejected;
		data.noteCompleted = req.body.noteRejected;
		data.noteClosed = req.body.noteClosed;

		data.save(function(err){
			if (err) {
				common.errHanlder(res, err);
				return;
			}

			res.json({
				err: null,
				message: 'Document successfully updated.'
			});
		});
	});
}

// Return first entry from the Settings collection
exports.getSettings = function(name, callback){
	settingsModel.find({})
		.limit(1)
		.populate('technicalLeads serviceLineLeads developers supports', 'fullname')
		.exec(function(err, data){
			if (err) {
				callback(err);
				return;
			}

			callback(null, data[0][name]);
	});
}