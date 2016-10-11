'use strict'

var auditModel = require('./audittrail.model');
var mongoose = require('mongoose');
var schema = mongoose.Schema;

module.exports = {
	approvalsObject: {
		approvalType: {type: String},
		approver: {type: schema.Types.ObjectId, ref: 'User'},
		status: {type: String},
		dateAction: {type: Date},
		comments: {type: String}
	}
}