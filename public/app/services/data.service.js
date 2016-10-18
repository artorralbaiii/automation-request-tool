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

			function authenticate(creds) {
				$http.post('/api/users/authenticate', {
					email: creds.email,
					password: creds.password
				})
				.success(function(data){
					console.log(data);
				})
				.catch(function(message) {
					console.log('[dataservice] Error: ' + message);
				});
			}

		}

})();