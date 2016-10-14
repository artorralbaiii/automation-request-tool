'use strict'

var commonObjects = require('./common.objects');
var mailController = require('../controllers/mail.server.controller');
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var approvalsSchema = new schema(commonObjects.approvalsObject); 

var changeRequestSchema = new schema({
	changeNumber: {type: String, require: true, index: {unique: true}},
	status: {type: String, require:true, default: 'Draft'},
	previousStatus: {type: String},
	approvals: approvalsSchema,
	requestSummary: {type: String},
	requestedBy: {type: schema.Types.ObjectId, ref: 'User'},
	dateRequested: {type: Date, default: Date.now},
	targetDeployment: {type: Date},
	detailedDescription: {type: String},
	tester: {type: schema.Types.ObjectId, ref: 'User'},
	uatResult: {type: String},
	uatCompletionDate: {type: Date},
	comments: {type: String},
	project: {type: schema.Types.ObjectId, ref: 'Project'}
}, {timestamps: true});

var changeRequestModel = mongoose.model('ChangeRequest', changeRequestSchema);


changeRequestSchema.post('save', function(doc){
	if (doc.status != doc.previousStatus &&
		doc.status != 'Draft') {

		commonObjects.processWorkflow('ChangeRequest', doc, function(noteid, recipient){
			changeRequestModel.findOne(doc)
				.select(recipient)
				.populate(recipient, 'email -_id')
				.exec(function(err, data){
					if (err) {
						console.log('[Change Model] Problem fetching recipients: ' + err.message);
						return;
					}

					mailController.sendEmail(noteid, data[recipient]);
				});
		});
	}
});

module.exports = changeRequestModel;