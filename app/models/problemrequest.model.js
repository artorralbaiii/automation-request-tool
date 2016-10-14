var mongoose = require('mongoose');
var schema = mongoose.Schema;
var commonObjects = require('./common.objects');
var mailController = require('../controllers/mail.server.controller');

var approvalsSchema = new schema(commonObjects.approvalsObject); 

var problemRequestSchema = new schema({
	problemNumber: {type: String, require: true, index: {unique: true}},
	status: {type: String, require: true, default: 'Draft'},
	problemSummary: {type: String},
	reportedBy: {type: schema.Types.ObjectId, ref: 'User'},
	dateReported: {type: Date, default: Date.now},
	targetFixDate: {type: Date},
	detailedDescription: {type: String},
	assignedSupport: {type: schema.Types.ObjectId, ref: 'User'},
	problemType: {type: String},
	analysis: {type: String},
	action: {type: String},
	project: {type: schema.Types.ObjectId, ref: 'Project'},
	previousStatus: {type: String}
}, {timestamps: true});

var problemModel = mongoose.model('ProblemRequest', problemRequestSchema);

problemRequestSchema.post('save', function(doc){
	if (doc.status != doc.previousStatus && 
		doc.status !== 'Draft' ) {
		commonObjects.processWorkflow('ProblemRequest', doc, function(noteid, recipient){

			problemModel.findOne(doc)
			.select(recipient)
			.populate(recipient, 'email -_id')
			.exec(function(err, data){
				if (err) {
					console.log('[Problem Model] Problem fetching recipients: ' + err.message);
					return;
				}

				mailController.sendEmail(noteid, data[recipient]);

			});			
		});
	}
});

module.exports = problemModel;