(function(){

	'use strict'

	angular.module('app.service')
		.factory('dataservice', dataservice);

		dataservice.$inject = ['$http'];

		function dataservice($http) {

			var service = {
				authenticate: authenticate
			}

			return service;

			//////////

			function authenticate(creds, callback) {
				$http.post('/api/users/authenticate', {
					email: creds.email,
					password: creds.password
				})
				.success(function(data){

					console.log(data);

					if (data.err) {
						callback(data.err);
					} else {
						callback();
					}
				})
				.catch(function(message) {
					callback(message);
					console.log('[dataservice] Error: ' + message);
				});
			}

		}

})();