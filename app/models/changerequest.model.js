var mongoose = require('mongoose');
var commonObjects = require('./common.objects');
var schema = mongoose.Schema;

var approvalsSchema = new schema(commonObjects.approvalsObject); 

var changeRequestSchema = new schema({
	changeNumber: {type: String, require: true, index: {unique: true}},
	status: {type: String, require:true},
	approvals: [approvalsSchema],
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

module.exports = mongoose.model('ChangeRequest', changeRequestSchema);