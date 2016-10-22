(function(){

	'use strict'

	angular.module('app.service')
		.factory('dataService', dataService);

		dataService.$inject = ['$http'];

		function dataService($http) {

			var service = {
				authenticate: authenticate,
				changePassword: changePassword,
				getSession: getSession,
				getUsers: getUsers,
				logout: logout
			}

			return service;

			//////////

			function authenticate(creds, callback) {
				$http.post('/api/users/authenticate', {
					email: creds.email,
					password: creds.password
				})
				.then(function(response){
					if (response.data.err) {
						callback(response.data.err);
					} else {
						callback();
					}
				})
				.catch(function(message) {
					callback(message);
					console.log('[dataservice] Error: ' + message);
				});
			};

			function getSession() {
				return $http.get('/api/users/session');
			}

			function logout() {
				return $http({ method: 'DELETE', url: '/api/users/logout' });
			}

			function changePassword(id, password) {
				return $http({
					method: 'PUT',
					url: '/api/users/' + id + '/changepassword',
					data: {password: password}
				});
			}

			function getUsers(offset, limit) {
				return $http.get('/api/users/' + offset + '/' + limit);
			}

		}

})();