(function(){

	angular.module('app.controller')
		.controller('Nav', Nav);

		Nav.$inject = ['$rootScope' ,'$location', 'dataService'];

		//////////

		function Nav($scope, $location, dataService){
			var vm = this;

			vm.showMenu = false;
			vm.session = null;
			vm.logout = logout;

			//////////

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