(function(){

	'use strict'

	angular.module('app.controller')
		.controller('ProjectNew', ProjectNew);

	ProjectNew.$inject = ['dataService', 'toastr', '$location'];

	//////////

	function ProjectNew(dataService, toastr, $location) {
		var vm = this;

		vm.formData = {};
		vm.formData.isDeployed = false;
		vm.validation = [];
		vm.users = [];

		vm.validate = validate;
		vm.pullUsers = pullUsers;
		vm.submit = submit;

		//////////

		function submit(frm) {
			if (frm.$valid) {				
				var data = _.clone(vm.formData);

				data.businessOwners = _.pluck(data.businessOwners, '_id');
				data.developers = _.pluck(data.developers, '_id');
				data.supports = _.pluck(data.supports, '_id');

				dataService.createProject(data)
				.then(function(response){
					$location.path('/');
					toastr.success('Success!', 'New project successfully created.')
				})
				.catch(function(response){
					toastr.error('Error!', response.data.err);
				});
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

		function validate(fld, frm) {

			var fldName = {
				applicationName: 'Application Name',
				description: 'App Purpose / Description',
				version: 'Version',
				businessOwners: 'Business Owner(s)',
				developers: 'Developer(s)',
				supports: 'Support(s)'
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
					true;
				} else if(frm[fld].$error.required) {
					vm.validation[fld] = 'Please enter ' + fldName[fld]; 
					return true;
				}
			}

			return false;

		}
		
	}

})();