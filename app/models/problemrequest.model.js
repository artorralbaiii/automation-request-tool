var mongoose = require('mongoose');
var commonObjects = require('./common.objects');
var schema = mongoose.Schema;

var approvalsSchema = new schema(commonObjects.approvalsObject); 

var problemRequestSchema = new schema({
	problemNumber: {type: String, require: true, index: {unique: true}},
	status: {type: String, require: true},
	approvals: [approvalsSchema],
	problemSummary: {type: String},
	reportedBy: {type: schema.Types.ObjectId, ref: 'User'},
	dateReported: {type: Date, default: Date.now},
	targetFixDate: {type: Date},
	detailedDescription: {type: String},
	assignedSupport: {type: schema.Types.ObjectId, ref: 'User'},
	problemType: {type: String},
	analysis: {type: String},
	action: {type: String},
	project: {type: schema.Types.ObjectId, ref: 'Project'}
}, {timestamps: true});

module.exports = mongoose.model('ProblemRequest', problemRequestSchema);