'use strict'

var schema = require('mongoose').Schema;

module.exports = {
	approvalsObject: {
		approvalType: {type: String},
		approver: {type: schema.Types.ObjectId, ref: 'User'},
		status: {type: String},
		dateApproved: {type: Date}
	}
}