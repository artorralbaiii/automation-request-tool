(function(){

	angular.module('app.controller')
		.controller('Nav', Nav);

		Nav.$inject = ['$rootScope' ,'$location','sessionService', 'dataService'];

		//////////

		function Nav($scope, $location, sessionService, dataService){
			var vm = this;

			vm.showMenu = false;
			vm.session = null;
			vm.logout = logout;

			activate();

			//////////

			function activate() {
				vm.session = sessionService.getSession();

			}

			function logout(){
				dataService.logout()
					.then(function(response){
						if (!response.data.err) {
							$location.path('/login');
							vm.showMenu = false;
						}
					});
			}

			$scope.$on('LOGIN', function(event, data){
				if(data) {
					vm.session = data;
					vm.showMenu = true;
				}
			});

		}

})();