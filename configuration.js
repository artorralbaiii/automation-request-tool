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
				status: 'Request Assessment',
				noteId: 'noteApproval',
				previous: null
			},
			{
				status: 'Ongoing',
				noteId: 'noteApproval',
				previous: 'Request Assessment'
			},
			{
				status: 'Ongoing',
				noteId: 'noteReturnedToDeveloper',
				previous: 'UAT'
			},
			{
				status: 'UAT',
				noteId: 'noteToTester',
				previous: null
			},
			{
				status: 'Completed',
				noteId: 'noteCompleted',
				previous: null
			},
			{
				status: 'Requesting Additional Information',
				noteId: 'noteRejected',
				previous: null
			}
		]
	}
}
