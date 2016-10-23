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

				.when('/about', {
					templateUrl: 'app/views/pages/about.page.html'
				})

				.when('/changepassword/:userid', {
					templateUrl: 'app/views/pages/changepassword.page.html',
					controller: 'ChangePassword',
					controllerAs: 'vm'
				})

				.when('/login', {
					templateUrl : 'app/views/pages/login.page.html',
					controller: 'Login',
					controllerAs: 'vm',
					title: 'ART | Login'	
				})

				.when('/users', {
					templateUrl: 'app/views/pages/users.page.html',
					controller: 'User',
					controllerAs: 'vm',
					resolve: {
						Users : function(dataService) {
							return dataService.getUsers();
						}
					}
				})

				.otherwise({redirectTo : '/'});
				
	};

	function appRun($rootScope, $location, dataService) {
		$rootScope.$on('$routeChangeStart', function(event){

			dataService.getSession()
				.then(function(response){
					if (response.data.session.user) {
						$rootScope.$broadcast('LOGIN', response.data.session);
					} else {
						event.preventDefault();
						$location.path('/login');
					}
				})
				.catch(function(err){
					if (err.status === 401) {
						$location.path('/login');
					}
				});
		})
	};

})();