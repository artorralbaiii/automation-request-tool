module.exports = {
	errHandler : function(res, err, msg) {
		res.json({
			err: (msg ? msg : err.message)
		});
	},
	generateId : function() {
		var d = new Date();
		return d.getMonth() + '' + d.getDate() + '' + d.getYear() + '' + d.getHours() + '' + d.getMinutes() + '' + d.getSeconds();
	},
	removeDocument: function(req, res, model, callback) {
		model.findOneAndRemove({_id: req.params.id}, function(err, data){
			if (err) {
				common.errHandler(res);
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

	}
}