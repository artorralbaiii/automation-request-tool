var mongoose = require('mongoose');
var schema = mongoose.Schema;

var approvalsSchema = new schema({
	approvalType: {type: String},
	approver: {type: schema.Types.ObjectId, ref: 'User'},
	status: {type: String},
	dateApproved: {type: Date}
});

var changeRequestSchema = new schema({
	changeNumber: {type: String, require: true, index: {unique: true}},
	status: {type: String, require:true},
	approvals: approvalsSchema,
	requestSummary: {type: String},
	requestedBy: {type: schema.Types.ObjectId},
	dateRequested: {type: Date, default: Date.now},
	targetDeployment: {type: Date},
	detailedDescription: {type: String},
	tester: {type: schema.Types.ObjectId},
	uatResult: {type: String},
	uatCompletionDate: {type: Date},
	comments: {type: String},
}, {timestamps: true});

module.exports = mongoose.model('ChangeRequest', changeRequestSchema);