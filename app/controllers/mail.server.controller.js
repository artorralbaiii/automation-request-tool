'use strict'

var settingsController = require('./settings.server.controller');

exports.sendEmail = function(noteid, recipient){
	var recipientAddress;
	console.log(recipient);

	if (recipient) {
		if (Array.isArray(recipient)) {
			recipient.forEach(function(item, index) {
				recipientAddress += item.email;
			});
		} else {
			recipientAddress = recipient.email;
		}

		settingsController.getSettings(noteid, function(err, value){
			console.log('Mail Content is: ' + value);
			console.log('Mail has been sent to: ' + recipientAddress);
		});		
	} else {
		console.log('No recipients');
	}

}