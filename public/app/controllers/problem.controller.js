(function(){

	'use strict';

	angular.module('app.controller')
		.controller('Problem', Problem);

	Problem.$inject = ['dataService', 'ParentProject', '$location', 'toastr'];

	//////////

	function Problem(dataService, ParentProject, $location, toastr) {

		var vm = this;

		vm.formLabel = 'New';
		vm.newProblem = true;
		vm.project = {};
		vm.users = [];
		vm.formData = {};
		vm.validation = [];
		vm.validate = validate;
		vm.submit = submit;

		activate();

		//////////

		function activate() {

			if (!ParentProject.getProject()) {
				$location.path('/');
				return;
			}

			vm.project = ParentProject.getProject();
			vm.formData.project = vm.project._id;
			vm.formData.assignedSupport = _.pluck(vm.project.supports,'_id');
			vm.formData.assignedSupportDisplay = _.map(vm.project.supports, 
													   function(support) {
													       return support.fullname + '<' + support.email + '>'; 
												 	   }
												 ).join('; ');

			if (vm.newProblem) {
				vm.formData.status = 'Draft';
			}
		}

		function submit(frm, status) {
			
			if (frm.$valid) {
				vm.formData.status = status;

				if (vm.newProblem) {
					dataService.createProblem(vm.formData)
					.then(function(response){
						toastr.success('Success!', 'New problem successfully created.');
						$location.path('/');
					})
					.catch(function(response){
						toastr.error('Error!', response.data.err);
					});
				} else {

				}

			}

		}

		function validate(fld, frm){

			var fldName = {
				targetFixDate: 'Target Fix Date',
				problemSummary: 'Problem Summary',
				detailedDescription: 'Detailed Description',
				analysis: 'Analysis of the problem',
				action: 'Actions / Recommendations'				
			};

			if (frm[fld].$dirty || frm.$submitted) {
				
				if (frm[fld].$error.required) {
					vm.validation[fld] = 'Please enter ' + fldName[fld]; 
					return true;
				} else if (fld === 'targetFixDate') {
					if (frm[fld].$error.date) {
						vm.validation[fld] = 'Please enter a valid date.'; 
						return true;						
					}
				}

			}

			return false;

		}


	}

})();