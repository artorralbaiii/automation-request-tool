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
					controllerAs: 'vm',
					resolve: {
						Project: function(dataService, $rootScope) {
							$rootScope.$emit('LOAD');
							return dataService.getProjects();
						}
					}		
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
					controllerAs: 'vm'
				})

				.when('/project', {
					templateUrl : 'app/views/pages/project-new.page.html',
					controller: 'ProjectNew',
					controllerAs: 'vm'
				})

				.when('/users', {
					templateUrl: 'app/views/pages/users.page.html',
					controller: 'User',
					controllerAs: 'vm',
					resolve: {
						Users : function(dataService) {
							$rootScope.$emit('LOAD');
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