'use strict'

var commonObjects = require('./common.objects');
var mailController = require('../controllers/mail.server.controller');
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var approvals = {
	'BusinessOwner' : {
		approver: [{type: schema.Types.ObjectId, ref: 'User'}],
		status: {type: String, default: 'Pending'},
		dateAction: {type: Date},
		comments: {type: String}				
	},
	'TechnicalLead' : {
		approver: [{type: schema.Types.ObjectId, ref: 'User'}],
		status: {type: String, default: 'Pending'},
		dateAction: {type: Date},
		comments: {type: String}				
	},
	'ServiceLine' : {
		approver: [{type: schema.Types.ObjectId, ref: 'User'}],
		status: {type: String, default: 'Pending'},
		dateAction: {type: Date},
		comments: {type: String}				
	}
};

var changeRequestSchema = new schema({
	changeNumber: {type: String, require: true, index: {unique: true}},
	status: {type: String, require:true, default: 'Draft'},
	previousStatus: {type: String},
	approvals: approvals,
	requestSummary: {type: String},
	requestedBy: {type: schema.Types.ObjectId, ref: 'User'},
	dateRequested: {type: Date},
	targetDeployment: {type: Date},
	detailedDescription: {type: String},
	tester: {type: schema.Types.ObjectId, ref: 'User'},
	uatResult: {type: String},
	uatCompletionDate: {type: Date},
	comments: {type: String},
	project: {type: schema.Types.ObjectId, ref: 'Project'},
	processOwner: [{type: schema.Types.ObjectId, ref: 'User'}],
	availableAction: [{type: String}],
	developers: [{type: schema.Types.ObjectId}]
}, {timestamps: true});

var changeRequestModel = mongoose.model('ChangeRequest', changeRequestSchema);


changeRequestSchema.post('save', function(doc){
	if (!(doc.status === 'Draft' && doc.previousStatus === '')){

		commonObjects.processWorkflow('ChangeRequest', doc, function(noteid, recipient){
			changeRequestModel.findOne({_id: doc._id})
				.select(recipient)
				.populate(recipient, 'email -_id')
				.exec(function(err, data){
					if (err) {
						console.log('[Change Model] Problem fetching recipients: ' + err.message);
						return;
					}

					console.log(data);

					mailController.sendEmail(noteid, data[recipient]);
				});
		});
	}
});

module.exports = changeRequestModel;