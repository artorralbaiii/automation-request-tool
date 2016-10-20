(function(){
	'use strict'

	angular.module('app.router', ['ngRoute'])
		.config(getRoutes)
		.run(appRun);

	appRun.$inject = ['$rootScope', '$location', 'dataService', 'sessionService' ];
	getRoutes.$inject = ['$routeProvider', '$locationProvider'];

	////////// 

	function getRoutes($routeProvider, $locationProvider) {
			$routeProvider
				.when('/', {
					templateUrl : 'app/views/pages/home.page.html',
					controller: 'Home',
					controllerAs: 'vm'		
				})

				.when('/login', {
					templateUrl : 'app/views/pages/login.page.html',
					controller: 'Login',
					controllerAs: 'vm',
					title: 'ART | Login'	
				})

				.otherwise({redirectTo : '/'});

			$locationProvider.html5Mode({
				enabled : true,
				requireBase : false
			});
	};

	function appRun($rootScope, $location, dataService, sessionService) {
		$rootScope.$on('$routeChangeStart', function(event){

			dataService.getSession()
				.then(function(response){
					if (response.data.session.user) {
						sessionService.setSession(JSON.stringify(response.data.session));
					} else {
						event.preventDefault();
						sessionService.setSession(null);
						$location.path('/login');
					}
				})
				.catch(function(err){
					if (err.status === 401) {
						sessionService.setSession(null);
						$location.path('/login');
					}
				});
		})
	};

})();