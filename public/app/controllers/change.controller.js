(function(){

	'use strict';

	angular.module('app.controller')
		.controller('Change', Change);

	Change.$inject = ['Change', '$location', '$window', 'dataService', 'toastr', 'Settings', 'ParentProject'];

	//////////

	function Change(Change, $location, $window, dataService, toastr, Settings, ParentProject){
		var vm = this;

		vm.newChange = true;
		vm.formLabel = 'New';
		vm.project = {};
		vm.users = [];
		vm.formData = {};
		vm.validation = [];
		vm.validate = validate;
		vm.submit = submit;
		vm.back = back;
		vm.pullUsers = pullUsers;
		vm.settings = Settings.data.data;
		
		activate();

		//////////

		function activate(){
			
			vm.project = ParentProject.getProject();

			if (!vm.project ) {
				if (Change) {
					vm.project = Change.data.data.project;
				} else {
					back();
					return;
				}
			}

			if (Change) {
				vm.newChange = false;
			} else {
				vm.formData.status =  'Draft';
				vm.formData.project = vm.project._id;
				vm.formData.businessOwner = _.pluck(vm.project.businessOwners, '_id');
				vm.formData.developers = _.pluck(vm.project.developers, '_id');
				vm.formData.technicalLead = _.pluck(vm.settings.technicalLeads , '_id');
				vm.formData.serviceLine = _.pluck(vm.settings.serviceLineLeads, '_id');
			}

		} 

		function back() {

			var prevPath = $window.localStorage.getItem('prevPath');

			if (prevPath) {
				$location.path(prevPath);
			} else {
				$location.path('/');							
			}

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

		function submit(frm, status) {

			if (frm.$valid) {
				var data = _.clone(vm.formData);

				if (vm.newChange) {

					data.tester = data.tester._id;

					dataService.createChange(data)
					.then(function(response){
						toastr.success('Success!', 'New change successfully created.');
						back();
					})
					.catch(function(response){
						toastr.error('Error!', response.data.err);
					});
				} else {
					dataService.updateChange(data)
					.then(function(response){

						if (status === 'Draft') {
							toastr.success('Success!', 'Change successfully updated.');
						}

					})
					.catch(function(response){
						toastr.error('Error!', response.data.err);
					});
				}
			}

			
		}

		function validate(fld, frm) {
			
			var fldName = {
				requestSummary: 'Request Summary',
				targetDeployment: 'Target Deploy Date',
				detailedDescription: 'Detailed Description',
				tester: 'Tester'
			};

			if (frm[fld].$dirty || frm.$submitted) {

				if (fld==='tester') {

					if (!vm.formData[fld] || vm.formData[fld].length == 0) {
						vm.validation[fld] = 'Please enter ' + fldName[fld]; 
						frm[fld].$setValidity('unique', false);
						return true;						
					} else {
						frm[fld].$setValidity('unique', true);
					}					

				} else if(frm[fld].$error.required) {
					vm.validation[fld] = 'Please enter ' + fldName[fld]; 
					return true;
				}
			}

			return false;

		}


	}

})();