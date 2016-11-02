(function(){

	'use strict';

	angular.module('app.controller')
		.controller('Problem', Problem);

	Problem.$inject = ['dataService', 'ParentProject', '$location', 'toastr', 'Problem', 'sessionService'];

	//////////

	function Problem(dataService, ParentProject, $location, toastr, Problem, sessionService) {

		var vm = this;

		vm.formLabel = 'New';
		vm.newProblem = true;
		vm.project = {};
		vm.users = [];
		vm.formData = {};
		vm.validation = [];
		vm.validate = validate;
		vm.submit = submit;
		vm.showSaveAndSubmit = showSaveAndSubmit;
		vm.showResolve = showResolve;
		
		activate();

		//////////

		function activate() {

			if (!ParentProject.getProject()) {

				if (Problem) {
					vm.project = Problem.data.data.project;
				} else {
					$location.path('/');
					return;
				}
				
			} else {
				vm.project = ParentProject.getProject();
			}

			initProblem();

		}

		function initProblem() {


			if (Problem) {
				vm.formData = Problem.data.data;
				vm.newProblem = false;
				vm.formLabel = vm.project.applicationName;
				vm.formData.assignedSupportDisplay = _.map(Problem.data.data.assignedSupport, 
													   function(support) {
													       return support.fullname + '<' + support.email + '>'; 
												 	   }
												 ).join('; ');
				vm.formData.assignedSupport = _.pluck(Problem.data.data.assignedSupport,'_id');
				vm.formData.targetFixDate = new Date(Problem.data.data.targetFixDate);
				vm.project = Problem.data.data.project;
				vm.formData.project = vm.project._id;
			} else {
				vm.formData.project = vm.project._id;
				vm.formData.assignedSupport = _.pluck(vm.project.supports,'_id');
				vm.formData.assignedSupportDisplay = _.map(vm.project.supports, 
														   function(support) {
														       return support.fullname + '<' + support.email + '>'; 
													 	   }
													 ).join('; ');
				vm.formData.status = 'Draft';				
			}
		}

		function showSaveAndSubmit() {
			var currentuser = sessionService.getSession().user;

			return vm.newProblem || 
			       (vm.formData.status === 'Draft' && 
			       	Problem.data.data.reportedBy._id === currentuser
			       );   

		}

		function showResolve(){
			var currentuser = sessionService.getSession().user;

			return vm.formData.status === 'Ongoing' && 
			       ( vm.formData.assignedSupport.indexOf(currentuser) != -1  );
		}

		function submit(frm, status) {
			
			if (frm.$valid) {
				vm.formData.status = status;

				if (status === 'Ongoing') {
					vm.formData.dateReported = new Date();
				}

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
					dataService.updateProblem(vm.formData)
					.then(function(response){
						if (status === 'Draft') {
							toastr.success('Success!', 'Problem successfully updated.');
						} else if (status === 'Ongoing') {
							toastr.success('Success!', 'Problem successfully submitted.');
							$location.path('/');
						} else if (status === 'Closed') {
							toastr.success('Success!', 'Problem successfully closed.');
							$location.path('/');
						}
					})
					.catch(function(response){
						toastr.error('Error!', response.data.err);
					});
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