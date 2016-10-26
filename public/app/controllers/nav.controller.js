(function(){

	angular.module('app.controller')
		.controller('Nav', Nav);

		Nav.$inject = ['$rootScope' ,'$location', 'dataService'];

		//////////

		function Nav($rootScope, $location, dataService){
			var vm = this;

			vm.showMenu = false;
			vm.session = null;
			vm.logout = logout;

			activate();

			//////////

			function activate(){
				dataService.getSession()
					.then(function(response){
						if (response.data.session.user) {
							vm.session = response.data.session;
							vm.showMenu = true;
						} else {
							vm.showMenu = false;
						}
					})
					.catch(function(err){
						if (err.status === 401) {
							vm.showMenu = false;
							$location.path('/login');
						}
					});
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

			$rootScope.$on('LOGIN', function(event, data){
				if(data) {
					vm.session = data;
					vm.showMenu = true;
				}
			});

		}

})();