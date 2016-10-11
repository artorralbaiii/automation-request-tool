var mongoose = require('mongoose');
var schema = mongoose.Schema;

var auditSchema = new schema({
	parentId: {type: String},
	logs: [{
		modifiedBy: {type: schema.Types.ObjectId, ref: 'User'},
		logText: {type: String},
		logDate: {type: Date, default: Date.now}
	}]
}, {timestamps: true});

module.exports = mongoose.model('AuditLog', auditSchema);