(function(){

	'use strict';

	angular.module('app.controller')
		.controller('Change', Change);

	Change.$inject = ['Change', '$location', '$window', 'dataService', 'toastr', 'Settings', 'ParentProject', 'sessionService'];

	//////////

	function Change(Change, $location, $window, dataService, toastr, Settings, ParentProject, sessionService){
		var vm = this;

		vm.newChange = true;
		vm.formLabel = '';
		vm.project = {};
		vm.users = [];
		vm.formData = {};
		vm.validation = [];
		vm.validate = validate;
		vm.submit = submit;
		vm.back = back;
		vm.getNames = getNames;
		vm.isAssignedDeveloper = isAssignedDeveloper;
		vm.isAssignedTester = isAssignedTester;
		vm.isButtonAvailable = isButtonAvailable;
		vm.isCurrentApprover = isCurrentApprover;
		vm.isRequester = isRequester;
		vm.isEditable = isEditable;
		vm.pullUsers = pullUsers;
		vm.settings = Settings.data.data;
		vm.disableButton = false;
		
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
				vm.formLabel = vm.project.applicationName; 
				vm.newChange = false;
				vm.formData = Change.data.data;
				vm.formData.targetDeployment =  new Date(Change.data.data.targetDeployment);
				vm.formData.dateRequested = new Date(vm.formData.dateRequested);
			} else {
				vm.formLabel = vm.project.applicationName + ' | New';
				vm.formData.status =  'Draft';
				vm.formData.project = vm.project._id;
				vm.formData.businessOwners = _.pluck(vm.project.businessOwners, '_id');
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

		function getAction() {
			if (vm.formData.approvals.BusinessOwner.status ==='Pending') {
				return 'BusinessOwner';
			}
			if (vm.formData.approvals.TechnicalLead.status ==='Pending') {
				return 'TechnicalLead';
			}
			if (vm.formData.approvals.ServiceLine.status ==='Pending') {
				return 'ServiceLine';
			}
		}

		function getNames(arr) {
			return _.pluck(arr, 'fullname').join(';');
		}

		function isButtonAvailable(btn) {
			if (vm.formData.availableAction) {
				return (vm.formData.availableAction.indexOf(btn) != -1);
			} else {
				return false;
			}
		}

		function isAssignedDeveloper(){
			var currentuser = sessionService.getSession();
			return ( currentuser.admin || vm.formData.developers.indexOf(currentuser.user) != -1); 
		}

		function isAssignedTester(){
			if (vm.formData.tester) {
				var currentuser = sessionService.getSession();
				return ( currentuser.admin || vm.formData.tester._id === currentuser.user ); 					
			} else {
				return false;
			}
		}

		function isCurrentApprover() {
			var currentuser = sessionService.getSession();
			var action = getAction();
			
			
			if (vm.formData.approvals) {
				if (action) {
					var approvers = _.pluck(_.clone(vm.formData.approvals[action].approver), '_id');
					return ( currentuser.admin || approvers.indexOf(currentuser.user) != -1); 
				}
			} 

			return false;
		}


		function isEditable() {
			var currentuser = sessionService.getSession().user;

			if ( vm.newChange || 
				((vm.formData.status === 'Draft' ||
			    vm.formData.status === 'Requesting Additional Information') &&
			    vm.formData.requestedBy._id === currentuser) && vm.formData.status != 'Completed' ) {
				return true;
			} else {
				return false;
			}

		}

		function isRequester() {
			var currentuser = sessionService.getSession();
			return currentuser.admin || vm.formData.requestedBy._id === currentuser.user;
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

			vm.disableButton = true;

			if (frm.$valid) {
				var data = _.clone(vm.formData);

				if (status !== 'Approve') {
					data.status = status;				
				}

				if (vm.newChange) {

					data.dateRequested = new Date();
					data.tester = data.tester._id;

					dataService.createChange(data)
					.then(function(response){
						toastr.success('Success!', 'New change successfully created.');
						back();
					})
					.catch(function(response){
						toastr.error('Error!', response.data.err);
						vm.disableButton = false;
					});
				} else {

					if (status === 'Approve') {
		
				        var approvalData = {
							action: getAction(),
							status: data.status,
							id: data._id
						};

						dataService.approveChange(approvalData)
						.then(function(response){
							toastr.success('Success!', 'Change successfully approved.');
							back();
						})
						.catch(function(response){
							toastr.error('Error!', response.data.err);
							vm.disableButton = false;
						});	

					} else if (status === 'Requesting Additional Information' ) {
		
						promptComment(disapprove);
						vm.disableButton = false;

					} else if (status === 'UAT' || status === 'Ongoing' || status === 'Completed') {

						var uatData = {
							id: data._id,
							status: status,
							uatResult: data.uatResult,
							comments: data.comments
						}

						dataService.changeStatus(uatData)
						.then(function(response){
							toastr.success('Success!', 'Change successfully moved to ' + status + '.');
							back();
						})
						.catch(function(response){
							toastr.error('Error!', response.data.err);
							vm.disableButton = false;
						});

					} else {
						dataService.updateChange(data)
						.then(function(response){

							if (status === 'Request Assessment') {
								toastr.success('Success!', 'Change successfully submitted.');
								back();
							} else {
								toastr.success('Success!', 'Change successfully updated.');
								vm.disableButton = false;
							}

						})
						.catch(function(response){
							toastr.error('Error!', response.data.err);
							vm.disableButton = false;
						});						
					}

				}
			}

			
		}

		function promptComment(func) {
			bootbox.prompt({
			    title: "Please enter your comments.",
			    inputType: 'textarea',
			    callback: func
			});
		}

		function disapprove(comments) {
			if (comments !== null) {
				if (comments !== '') {
			        var approvalData = {
						action: getAction(),
						comments: comments,
						status: vm.formData.status,
						id: vm.formData._id
					};

					dataService.disapproveChange(approvalData)
					.then(function(response){
						toastr.success('Success!', 'Change successfully rejected.');
						back();
					})
					.catch(function(response){
						toastr.error('Error!', response.data.err);
					});						
				} else {
					bootbox.alert({
						message: 'Comment is required',
						callback: function(){
							promptComment(disapprove);							
						}
					})
				}
			} 
		}

		function validate(fld, frm) {
			
			if (!frm[fld]) {
				return false;
			}

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
				} else if (fld === 'targetDeployment') {
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