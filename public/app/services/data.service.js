(function(){

	'use strict'

	angular.module('app.service')
		.factory('dataService', dataService);

		dataService.$inject = ['$http'];

		function dataService($http) {
 
			var service = {
				approveChange: approveChange,
				disapproveChange: disapproveChange,
				authenticate: authenticate,
				changePassword: changePassword,
				changeStatus: changeStatus,
				createChange: createChange,  
				createProblem: createProblem,
				createProject: createProject,
				createUser: createUser,
				createSettings: createSettings,
				deleteDocument: deleteDocument,
				getChanges: getChanges, 
				getChangeById: getChangeById,
				getMyRequests: getMyRequests, 				
				getProblemById: getProblemById,
				getProblems: getProblems,
				getProjectById: getProjectById,
				getProjects: getProjects,
				getProjectsLite: getProjectsLite,
				getProjectsByPage: getProjectsByPage, 
				getSession: getSession,
				getSettings: getSettings,
				getUsers: getUsers,
				getUsersByKey: getUsersByKey,
				logout: logout,
				updateChange: updateChange,
				updateProblem: updateProblem,
				updateProject: updateProject,
				updateSettings: updateSettings,
				updateUser: updateUser
			}

			return service;

			//////////

			// Approve Change
			function approveChange(data){
				return $http({
					method: 'PUT',
					url: '/api/changes/' + data.id + '/approval',
					data: data
				});				
			}

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


			// Change Status

			function changeStatus(data){
				return $http({
					method: 'PUT',
					url: '/api/changes/' + data.id + '/status/' + data.status,
					data: data
				});				
			}

			// Create Change
			function createChange(data) {
				return $http.post('/api/changes', data);
			}

			// Create Problem

			function createProblem(data) {
				return $http.post('/api/problems', data);
			}

			// Create Project

			function createProject(data) {
				return $http.post('/api/projects', data);
			}

			// Create Settings
			function createSettings(data) {
				return $http.post('/api/settings', data);
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

			// Disapprove Change
			function disapproveChange(data){
				return $http({
					method: 'PUT',
					url: '/api/changes/' + data.id + '/disapproval',
					data: data
				});				
			}


			// Get Change By Id
			function getChangeById(id) {
				return $http.get('/api/changes/' + id);				
			}

			// Get Changes
			function getChanges() {
				return $http.get('/api/changes');				
			}

			// Get Project By Id
			function getProblemById(id) {
				return $http.get('/api/problems/' + id);
			}

			// Get Requests Related to the current user
			function getMyRequests() {
				return $http.get('/api/users/myrequests');
			}

			// Get Project By Id
			function getProblemById(id) {
				return $http.get('/api/problems/' + id);
			}

			// Get Problems
			function getProblems(){
				return $http.get('/api/problems');
			}

			// Get Project By Id
			function getProjectById(id) {
				return $http.get('/api/projects/' + id);
			}

			// Get projects
			function getProjects() {
				return $http.get('/api/projects');
			}

			// Get Partial Projects By Page
			function getProjectsByPage(offset, limit, search) {
				if (!search) {
					search = '';
				}
				search = 'search:' + search;
				return $http.get('/api/projects/' + search + '/' + offset + '/' + limit);
			}

			// Get projects parameterized
			function getProjectsLite(cols) {
				return $http.get('/api/projects/lite/' + cols);
			}

			// Get Settings
			function getSettings() {
				return $http.get('/api/settings');
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

			//Update Change
			function updateChange(data) {
				return $http({
					method: 'PUT',
					url: '/api/changes/' + data._id,
					data: data
				});				
			} 

			// Update Problem
			function updateProblem(data) {
				return $http({
					method: 'PUT',
					url: '/api/problems/' + data._id,
					data: data
				});				
			} 

			// Update Project
			function updateProject(data) {
				return $http({
					method: 'PUT',
					url: '/api/projects/' + data._id,
					data: data
				});
			}

			// Update Settings
			function updateSettings(data) {
				return $http({
					method: 'PUT',
					url: '/api/settings/' + data._id,
					data: data
				});
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