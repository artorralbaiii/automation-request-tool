(function(){
	'use strict'

	angular.module('app.controller')
		.controller('Login', Login);

		Login.$inject = ['dataservice'];

		function Login(dataservice) {
			var vm = this;

			vm.formData = {};
			vm.authenticate = authenticate;

			function authenticate() {
				dataservice.authenticate(vm.formData);
			};

		}

})();