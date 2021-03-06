(function(){

	'use strict'

	angular.module('app.controller')
		.controller('ProjectNew', ProjectNew);

	ProjectNew.$inject = ['dataService', 'toastr', '$location', 'Project', '$window', 'Settings', '$rootScope', 'sessionService'];

	//////////

	function ProjectNew(dataService, toastr, $location, Project, $window, Settings, $rootScope, sessionService) {
		var vm = this;

		vm.formData = {};
		vm.formData.isDeployed = false;
		vm.validation = [];
		vm.users = [];
		vm.validate = validate;
		vm.pullUsers = pullUsers;
		vm.submit = submit;
		vm.newProject = true;
		vm.formLabel = 'New';
		vm.back = back;
		vm.setDefaults = setDefaults;
		vm.isRequester = isRequester;

		initProject(Project);

		//////////

		function initProject(Prj) {
			if (Prj) {
				vm.formData = Prj.data.data;
				vm.newProject = false;
				vm.formLabel = Prj.data.data.applicationName;
				vm.formData.businessOwnersDisplay = getDisplayNames(Prj.data.data.businessOwners);
				vm.formData.developersDisplay = getDisplayNames(Prj.data.data.developers);
				vm.formData.supportsDisplay = getDisplayNames(Prj.data.data.supports);
			}
		}

		function getDisplayNames(names){
			return _.map(names,function(name) {
				return name.fullname + '<' + name.email + '>'; 
			 }).join('; ');
		}

		function pullUsers(qry) {
			dataService.getUsersByKey(qry)
			 .then(function(response){
				vm.users = response.data.data;			 	
			})
			 .catch(function(response){
			 	toastr.error('Error!', 'Unable to fetch users. Error >> ' + response.data.err);
			});
		}

		function back() {

			var prevPath = $window.localStorage.getItem('prevPath');

			if (prevPath) {
				$location.path(prevPath);
			} else {
				$location.path('/');							
			}

		}

		function isRequester() {
			var currentuser = sessionService.getSession();
			return currentuser.admin || vm.formData.requester._id === currentuser.user;
		}

		function setDefaults(){
			vm.formData.developers = Settings.data.data.developers;
			vm.formData.supports = Settings.data.data.supports;
		}

		function submit(frm) {
			if (frm.$valid) {				
				var data = _.clone(vm.formData);

				data.businessOwners = _.pluck(data.businessOwners, '_id');
				data.developers = _.pluck(data.developers, '_id');
				data.supports = _.pluck(data.supports, '_id');

				if (vm.newProject) {
					dataService.createProject(data)
					.then(function(response){
						$rootScope.$emit('APPEND_PROJECT', response.data.data);
						back();
						toastr.success('Success!', 'New project successfully created.')
					
					})
					.catch(function(response){
						toastr.error('Error!', response.data.err);
					});
				} else {
					dataService.updateProject(data)
					.then(function(response){
						toastr.success('Success!', 'Project successfully updated.')
					})
					.catch(function(response){
						toastr.error('Error!', response.data.err);
					});
				}

			}
		}

		function validate(fld, frm) {

			if (!frm[fld]) {
				return false;
			}

			var fldName = {
				applicationName: 'Application Name',
				description: 'App Purpose / Description',
				version: 'Version',
				businessOwners: 'Business Owner(s)',
				developers: 'Developer(s)',
				supports: 'Support(s)',
				serverName: 'Server Name',
				filePath: 'File Path'
			};

			if (frm[fld].$dirty || frm.$submitted) {
				if (fld === 'businessOwners' || fld === 'developers' || fld === 'supports') {
					if (!vm.formData[fld] || vm.formData[fld].length == 0) {
						vm.validation[fld] = 'Please enter ' + fldName[fld]; 
						frm[fld].$setValidity('unique', false);
						return true;						
					} else {
						frm[fld].$setValidity('unique', true);
					}
				} else if(frm[fld].$error.required) {
					if ( (fld === 'filePath' || fld === 'serverName') && !vm.formData.isDeployed ) {
						return false;
					} else {
						vm.validation[fld] = 'Please enter ' + fldName[fld]; 
						return true;
					}

				}
			}
	
			return false;

		}
		
	}

})();