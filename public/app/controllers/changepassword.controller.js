(function(){

	angular.module('app.controller')
		.controller('ChangePassword', ChangePassword);

		ChangePassword.$inject = ['dataService', 'toastr', '$location', '$routeParams'];

		//////////

		function ChangePassword(dataService, toastr, $location, $routeParams){
			var vm = this;
			vm.submit = submit;
			vm.validate = validate;
			vm.generalErrors = [];
			vm.validation = {};

			function submit(frm) {
				vm.generalErrors = [];

				if (frm.$valid) {	
					dataService.changePassword($routeParams.userid, vm.formData.newPass)
						.then(function(response){
							if (!response.data.err) {
								toastr.success(response.data.message, 'Success!', { timeOut: 2000 });							
								$location.path('/');
							}
						})
						.catch(function(response){
							vm.generalErrors.push(response.data.err);
						});
				}

			}

			function validate(fld, frm) {

				var fldName = {
					'newPass': 'New Password',
					'confirmPass': 'Confirm Password'
				}		

				if (frm[fld].$dirty || frm.$submitted) {
					if (frm[fld].$error.required) {
						vm.validation[fld] = 'Please enter ' + fldName[fld] + '.';
						return true;
					} else {
						if (frm.$submitted) {
							if (fld === 'confirmPass') {
								if (vm.formData.newPass !== '' && 
									vm.formData.newPass !== vm.formData.confirmPass) {
									 	vm.validation[fld] = 'Confirm password not match.';
									 	 frm[fld].$setValidity('unique', false);
									 	return true;								
								} else {
									frm[fld].$setValidity('unique', true);	
								}
							}							
						}
					}				
				}

				return false;

			}
		}
})();