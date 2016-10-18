(function(){
	'use strict'

	angular.module('app.router', ['ngRoute'])
		.config(function($routeProvider, $locationProvider){
			$routeProvider

			.when('/', {
				templateUrl : 'app/views/pages/home.page.html'			
			})

			.when('/login', {
				templateUrl : 'app/views/pages/login.page.html',
				controller: 'Login',
				controllerAs: 'vm'			
			})

			.otherwise({redirectTo : '/'});


			$locationProvider.html5Mode({
				enabled : true,
				requireBase : false
			});
	});

})();