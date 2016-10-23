(function(){

	'use strict'

	angular.module('app.service')
		.factory('dataService', dataService);

		dataService.$inject = ['$http'];

		function dataService($http) {

			var service = {
				authenticate: authenticate,
				changePassword: changePassword,
				createUser: createUser,
				deleteDocument: deleteDocument,
				getSession: getSession,
				getUsers: getUsers,
				logout: logout,
				updateUser: updateUser
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
				.catch(function(response) {
					callback(response.statusText);
					console.log('[dataservice] Error: ' + response.statusText);
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

			function getUsers() {
				return $http.get('/api/users');
			}

			function updateUser(data) {
				return $http({
					method: 'PUT',
					url: '/api/users/' + data._id,
					data: data
				});
			}

			function createUser(data) {
				return $http.post('/api/users', data);
			}

			function deleteDocument(resourceName, id) {
				return $http({
					method: 'DELETE',
					url: '/api/' + resourceName + '/' + id
				});
			}

		}

})();