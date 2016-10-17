(function(){
	'use strict'

	angular.module('app.router', ['ngRoute'])
		.config(function($routeProvider, $locationProvider){
			$routeProvider

			.when('/', {
				templateUrl : 'app/views/pages/home.page.html'			
			})

			.otherwise({redirectTo : '/'});


			$locationProvider.html5Mode({
				enabled : true,
				requireBase : false
			});
	});

})();