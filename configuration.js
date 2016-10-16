'use strict'

module.exports = {
	mongodbUri: 'mongodb://admin:passw0rd@ds021326.mlab.com:21326/artdb',
	secretKey: 'BTuxMrP48k^AEMVH',
	workflowMap: {
		'ProblemRequest' : [
			{
				status: 'Ongoing',
				noteId: 'noteToSupport',
				recipient: 'assignedSupport',
				previous: null
			},
			{
				status: 'Closed',
				noteId: 'noteClosed',
				recipient: 'reportedBy',
				previous: null
			}
		],
		'ChangeRequest': [		
			{
				status: 'Draft',
				noteId: 'noteRejected',
				recipient: 'processOwner',
				previous: 'Request Assessment'
			},
			{
				status: 'Request Assessment',
				noteId: 'noteApproval',
				recipient: 'processOwner',
				previous: null
			},
			{
				status: 'Ongoing',
				noteId: 'noteToDeveloper',
				recipient: 'processOwner',
				previous: 'Request Assessment'
			},
			{
				status: 'Ongoing',
				noteId: 'noteReturnedToDeveloper',
				recipient: 'processOwner',
				previous: 'UAT'
			},
			{
				status: 'UAT',
				noteId: 'noteToTester',
				recipient: 'processOwner',
				previous: null
			},
			{
				status: 'Completed',
				noteId: 'noteCompleted',
				recipient: 'processOwner',
				previous: null
			},
			{
				status: 'Requesting Additional Information',
				noteId: 'noteRejected',
				recipient: 'processOwner',
				previous: null
			}
		]
	}
}
