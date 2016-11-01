'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var objectTemplate = {
		requestType: {type: String},
		requestId: {type: String},
		requestStatus: {type: String},
		requestTitle: {type: String}	
}

var poSchema = new schema({
	user: String,
	myRequests: [objectTemplate],
	pendingActions : [objectTemplate]
});

module.exports = mongoose.model('ProcessOwner', poSchema);