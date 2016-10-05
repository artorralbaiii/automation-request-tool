module.exports = {
	mongodbUri: 'mongodb://admin:passw0rd@ds021326.mlab.com:21326/artdb',
	secretKey: 'BTuxMrP48k^AEMVH',
	generateId : function() {
		var d = new Date();
		return d.getMonth() + '' + d.getDate() + '' + d.getYear() + '' + d.getHours() + '' + d.getMinutes() + '' d.getSeconds();
	}
}
