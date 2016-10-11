var settingsModel = require('../models/settings.model');
var common = require('./common.functions');

exports.getDocument = function(req, res){
	settingsModel.find({})
		.limit(1)
		.exec(function(err, doc){
			if (err) {
				common.errHanlder(res, err);
				return;
			}

			res.json({
				err: null,
				data: doc
			});
	});
}

exports.update = function(req, res) {
	settingsModel.findOne({_id: req.params.id}, function(err, doc){
		if (err) {
			common.errHanlder(res, err);
			return;
		}

		if (!doc) {
			doc = new settingsModel();	
		}

		doc.technicalLeads = req.body.technicalLeads;
		doc.serviceLineLeads = req.body.serviceLineLeads;
		doc.developers = req.body.developers;
		doc.supports = req.body.supports;
		doc.noteApproval = req.body.noteApproval;
		doc.noteToDeveloper = req.body.noteToDeveloper;
		doc.noteReturnedToDeveloper = req.body.noteReturnedToDeveloper;
		doc.noteToSupport = req.body.noteToSupport;
		doc.noteToTester = req.body.noteToTester;
		doc.noteApproved = req.body.noteApproved;
		doc.noteRejected = req.body.noteRejected;
		doc.noteCompleted = req.body.noteRejected;
		doc.noteClosed = req.body.noteClosed;

		doc.save(function(err){
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