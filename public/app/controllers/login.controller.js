(function(){
	'use strict'

	angular.module('app.controller')
		.controller('Login', Login);

		Login.$inject = ['dataservice', '$location'];

		function Login(dataservice, $location) {
			var vm = this;

			vm.title = 'ART | Login';
			vm.formData = {};
			vm.validation = {};
			vm.authenticate = authenticate;
			vm.validate = validate;

			//////////

			function authenticate(frm) {

				if (frm.$valid) {
					dataservice.authenticate(vm.formData, function(err){
						if (err) {


							if (err.indexOf('email')) {
								vm.validation.email = err;
								frm.email.$setValidity(err, false);
								console.log("Pass");
								console.log(frm);
							}

							if (err.indexOf('password')) {
								vm.validation.password = err;
								// frm.password.$setValidity(err, false);
							}

							return;
						}

						$location.path('/');

					});										
				}	

			};

			function validate(frm, caller) {

				var defaultCondition = frm[caller].$dirty || frm.$submitted;
				var result = false;
				console.log(frm.email.$invalid);

				switch (caller) {

					case 'email': {

						if (defaultCondition) {
							if (frm.email.$error.required) {
								vm.validation.email = 'Please enter your email.';
								result = true;	
							} 						
						}

						return result;

						break;
					}

					case 'password': {

						if (defaultCondition) {
							if (frm.password.$error.required) {
								vm.validation.password = 'Please enter your password.';
								result = true;			
							}							
						}

						return result;

						break;
					}

				}
			}

		}

})();