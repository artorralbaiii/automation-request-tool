var mongoose = require('mongoose');
var schema = mongoose.Schema;

var settingsSchema = new schema({
	technicalLeads: [{type: schema.Types.ObjectId, ref: 'User'}],
	serviceLineLeads: [{type: schema.Types.ObjectId, ref: 'User'}],
	developers: [{type: schema.Types.ObjectId, ref: 'User'}],
	supports: [{type: schema.Types.ObjectId, ref: 'User'}],
	noteApproval: {type: String},
	noteToDeveloper: {type: String},
	noteReturnedToDeveloper: {type: String},
	noteToSupport: {type: String},
	noteToTester: {type: String},
	noteApproved: {type: String},
	noteRejected: {type: String},
	noteCompleted: {type: String},
	noteClosed: {type: String}
}, {timestamps: true});

module.exports = mongoose.model('Settings', settingsSchema);