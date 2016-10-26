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
				createProject: createProject,
				deleteDocument: deleteDocument,
				getProjects: getProjects,
				getSession: getSession,
				getUsers: getUsers,
				getUsersByKey: getUsersByKey,
				logout: logout,
				updateUser: updateUser
			}

			return service;

			//////////

			// User Authentication
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

			// Create Project

			function createProject(data) {
				return $http.post('/api/projects', data);
			}

			// Create User
			function createUser(data) {
				return $http.post('/api/users', data);
			}

			// Change User Password 
			function changePassword(id, password) {
				return $http({
					method: 'PUT',
					url: '/api/users/' + id + '/changepassword',
					data: {password: password}
				});
			}

			// Delete Resource (GENERIC)
			function deleteDocument(resourceName, id) {
				return $http({
					method: 'DELETE',
					url: '/api/' + resourceName + '/' + id
				});
			}

			// Get projects
			function getProjects() {
				return $http.get('/api/projects');
			}

			// Get current session
			function getSession() {
				return $http.get('/api/users/session');
			}
			
			// Get All Users
			function getUsers() {
				return $http.get('/api/users');
			}

			// Get User/s user key
			function getUsersByKey(qry) {
				return $http.get('/api/users/' + qry + '/search');				
			}

			// Logout | Remove Session 
			function logout() {
				return $http({ method: 'DELETE', url: '/api/users/logout' });
			}

			// Update user
			function updateUser(data) {
				return $http({
					method: 'PUT',
					url: '/api/users/' + data._id,
					data: data
				});
			}


		}

})();