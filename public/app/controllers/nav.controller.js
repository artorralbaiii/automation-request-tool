(function(){

	angular.module('app.controller')
		.controller('Nav', Nav);

		Nav.$inject = ['sessionService'];

		//////////

		function Nav(sessionService){
			var vm = this;

			vm.showMenu = false;
			vm.session = null;

			activate();

			//////////

			function activate() {

				vm.session = sessionService.getSession();

				if (vm.session) {
					vm.showMenu = true;
				}

			}

		}

})();