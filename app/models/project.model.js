"use strict";

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var projectSchema = new schema({
	projectId: {type: String, required: true, index: {unique: true}},
	isDeployed: {type: Boolean, required: true, default: false},
	requester: {type: String, required: true},
	developers: [{type: schema.Types.ObjectId, ref: 'User'}],
	description: {type: String},
	version: {type: String},
	businessOwner: {type: schema.Types.ObjectId},
	supports: [{type: schema.Types.ObjectId, ref: 'User'}],
	changeRequests: [{type: schema.Types.ObjctId, ref: 'ChangeRequest'}],
	problemRequests: [{type: schema.Types.ObjectId, ref: 'ProblemRequest'}]
}, {timestamps: true});

module.exports = mongoose.model('Project', projectSchema);