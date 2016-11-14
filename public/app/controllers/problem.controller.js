(function(){

	'use strict';

	angular.module('app.controller')
		.controller('Problem', Problem);

	Problem.$inject = ['dataService', 'ParentProject', '$location', 'toastr', 'Problem', 'sessionService', '$window', '$filter'];

	//////////

	function Problem(dataService, ParentProject, $location, toastr, Problem, sessionService, $window, $filter) {

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
		vm.back = back;
		vm.isEditable = isEditable;
		vm.isAssignedSupport = isAssignedSupport;
		
		activate();

		//////////

		function activate() {

			if (!ParentProject.getProject()) {

				if (Problem) {
					vm.project = Problem.data.data.project;
				} else {					
					back();
					return;
				}
				
			} else {
				vm.project = ParentProject.getProject();
			}

			initProblem();

		}


		function back() {

			var prevPath = $window.localStorage.getItem('prevPath');

			if (prevPath) {
				$location.path(prevPath);
			} else {
				$location.path('/');							
			}

		}

		function initProblem() {


			if (Problem) {
				vm.formLabel =  vm.project.applicationName;
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
				vm.formData.dateReported = new Date(vm.formData.dateReported);
				
			} else {
				vm.formLabel =  vm.project.applicationName + ' | New';
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

		function isEditable() {
			var currentuser = sessionService.getSession();

			if ( vm.newProblem || 
				((vm.formData.status === 'Draft') && (vm.formData.reportedBy._id === currentuser.user || currentuser.admin )  )) {
				return true;
			} else {
				return false;
			}

		}

		function isAssignedSupport(){
			var currentuser = sessionService.getSession();
			return ( currentuser.admin || vm.formData.assignedSupport.indexOf(currentuser.user) != -1); 
		}

		function showSaveAndSubmit() {
			var currentuser = sessionService.getSession();

			return vm.newProblem || 
			       (vm.formData.status === 'Draft' && 
			       	(Problem.data.data.reportedBy._id === currentuser.user || currentuser.admin)
			       );   

		}

		function showResolve(){
			var currentuser = sessionService.getSession();

			return vm.formData.status === 'Ongoing' && 
			       ( vm.formData.assignedSupport.indexOf(currentuser.user) != -1  || currentuser.admin);
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
						back();
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
							back();
						} else if (status === 'Closed') {
							toastr.success('Success!', 'Problem successfully closed.');
							back();
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