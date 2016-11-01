'use strict'

var poModel = require('../models/process-owner.model');


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

		return prefix + d.getFullYear() + '-' +
		       ('0' + (d.getMonth() + 1)).slice(-2)  + '' +
		       ('0' + d.getDate()).slice(-2) + '' +
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
					res.json({
						err: null,
						message: 'Document successfully removed.'
					});					
				}
			}
		});

	},

	registerProcess: function(processArr, callback) {
		
		/*
			Expected: items in the processArr param should have the following properties below.

			user = Current User ID
			type = Type of the process. "myRequests or pendingActions"
			reqType = Type of the request. "Problem Request or Change Request"
			reqId = Problem or Change Request ID
			reqStatus = Status of the Problem or Change Request
			reqTitle = Problem Summary or Change Summary
	
		*/

		processArr.forEach(function(elem){
			poModel.findOne({user: elem.user}, function(err, data){
				if (err) {
					callback(err);
					return;
				}

				if (!data) {
					data = new poModel();
				}

				data.user = elem.user;
				data[elem.type] = {
					requestType: elem.reqType,
					requestId: elem.reqId,
					requestStatus: elem.reqStatus,
					requestTitle: elem.reqTitle
				};

				data.save(function(err){
					if (err) {
						callback(err);
						return;
					}

				}) ;
			});

		});

		callback(null);

	},

	removeProcess: function(processArr, callback) {
		
		/*
			Expected: items in the processArr param should have the following properties below.

			user = Current User ID
			type = Type of the process. "myRequests or pendingActions"
			reqId = Problem or Change Request ID
		
		*/

		processArr.forEach(function(elem){
			poModel.findOne({user: elem.user}, function(err, data){
				if (err) {
					callback(err);
					return;
				}

				data[elem.type].forEach(function(elemObject){
					if (elemObject.reqId === elem.reqId) {
						data[elem.type].pop(elemObject);
					}
				});

			});
		});
	}

}