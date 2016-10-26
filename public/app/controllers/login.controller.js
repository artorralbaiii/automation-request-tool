(function(){
	'use strict'

	angular.module('app.controller')
		.controller('Login', Login);

		Login.$inject = ['dataService', '$location', '$rootScope'];

		function Login(dataService, $location, $rootScope) {
			var vm = this;

			vm.loginCaption = 'Login';
			vm.authenticating = false;
			vm.formData = {};
			vm.validation = [];
			vm.authenticate = authenticate;
			vm.validate = validate;

			//////////

			function authenticate(frm) {
				vm.validation = [];

				if (frm.$valid) {
					vm.loginCaption = 'Authenticating...';
					vm.authenticating = true;
					dataService.authenticate(vm.formData, function(err){
						vm.loginCaption = 'Login';
						vm.authenticating = false;

						if (err) {
							vm.validation.push(err);
							return;
						}

						$location.path('/');

					});										
				} else {
					vm.validate(frm);
				}	

			};

			function validate(frm) {

				if (frm.email.$error.required) {
					vm.validation.push('Please enter your email.');
				} else if (frm.email.$invalid) {
					vm.validation.push('Please enter a valid email.'); 
				}

				if (frm.password.$error.required) {
					vm.validation.push('Please enter your password.');
				}							
			}

		}

})();