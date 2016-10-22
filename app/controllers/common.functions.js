'use strict'

var errHandlerFunction = function(res, err, msg, statusCode) {

		if (statusCode) {
			res.status(statusCode);
		} else {
			res.status(500);
		}

		if (!msg) {
			console.log(err);
		}

		res.json({
			err: (msg ? msg : err.message)
		});
}

module.exports = {
	errHandler : errHandlerFunction,
	generateId : function(pre) {
		var d = new Date();
		var prefix = (pre ? pre + '-' : '' );

		return prefix + d.getYear() + '' +
		       ('0' + d.getMonth()).slice(-2)  + '' +
		       ('0' + d.getDay()).slice(-2) + '' +
		       ('0' + d.getHours()).slice(-2)  + '' + 
		       ('0' + d.getMinutes()).slice(-2) + '' +
		       ('0' + d.getSeconds()).slice(-2);
	},
	
	removeDocument: function(req, res, model, callback) {
		model.findOneAndRemove({_id: req.params.id}, function(err, data){
			if (err) {
				errHandlerFunction(res, err);
			} else {
				if (callback) {
					callback(data.project);
				} else {
					if (data) {
						errHandlerFunction(res, null, 'No documents found.', 409);
						return;
					}

					res.json({
						err: null,
						message: 'Document successfully removed.'
					});					
				}
			}
		});

	}
}