"use strict";

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var projectSchema = new schema({
	projectId: {type: String, require: true, index: {unique: true}},
	isDeployed: {type: Boolean, default: false},
	requester: {type: schema.Types.ObjectId , ref: 'User', require: true},
	developers: [{type: schema.Types.ObjectId, ref: 'User'}],
	description: {type: String},
	version: {type: String},
	businessOwner: {type: schema.Types.ObjectId, ref: 'User'},
	supports: [{type: schema.Types.ObjectId, ref: 'User'}],
	changeRequests: [{type: schema.Types.ObjectId, ref: 'ChangeRequest'}],												 
	problemRequests: [{type: schema.Types.ObjectId, ref: 'ProblemRequest'}]
}, {timestamps: true});

module.exports = mongoose.model('Project', projectSchema);