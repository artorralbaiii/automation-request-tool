(function(){

	angular.module('app.controller')
		.controller('MainController', MainController);

		MainController.$inject = ['$rootScope'];

		//////////

		function MainController($rootScope){

			var vm = this;
			vm.loading = false;

			$rootScope.$on('LOAD', function(){
				vm.loading = true;
			});

			$rootScope.$on('UNLOAD', function(){
				vm.loading = false;
			});

		}

})();