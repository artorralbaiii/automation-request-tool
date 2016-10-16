'use strict'

var configuration = require('../../configuration');
var mongoose = require('mongoose');
var schema = mongoose.Schema;

module.exports = {
	approvalsObject: {
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
	},

	processWorkflow : function(type, data, callback) {
		var flow = configuration.workflowMap[type];

		flow.forEach(function(item, index){
			if (item.status === data.status) {
				if (item.previous) {
					if (item.previous === data.previousStatus){
						callback(item.noteId, item.recipient);
						return;
					}
				} else {
					callback(item.noteId, item.recipient);
					return;
				}
			} 
		});
	}
}