(function(){
	'use strict'

	angular.module('app.router', ['ngRoute'])
		.config(getRoutes)
		.run(appRun);

	appRun.$inject = ['$rootScope', '$location', 'dataService', 'sessionService', '$window' ];
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
							return dataService.getMyProjectsByPage(0, 5, '');
						},
						RelatedRequests: function(dataService){
							return dataService.getMyRequests();
						}
					}		
				})

				.when('/about', {
					templateUrl: 'app/views/pages/about.page.html'
				})

				.when('/change/:changeId', {
					templateUrl : 'app/views/pages/change.page.html',
					controller: 'Change',
					controllerAs: 'vm',
					resolve: {
						Change: function(dataService, $route){
							if ($route.current.params.changeId === 'new') {
								return null;
							} else {
								return dataService.getChangeById($route.current.params.changeId);								
							}							
						},

						Settings : function(dataService){
							return dataService.getSettings();							
						}
					}					
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

				.when('/problem/:problemId', {
					templateUrl : 'app/views/pages/problem.page.html',
					controller: 'Problem',
					controllerAs: 'vm',
					resolve: {
						Problem: function(dataService, $route){
							if ($route.current.params.problemId === 'new') {
								return null;
							} else {
								return dataService.getProblemById($route.current.params.problemId);								
							}							
						}
					}					
				})

				.when('/project/:id', {
					templateUrl : 'app/views/pages/project.page.html',
					controller: 'ProjectNew',
					controllerAs: 'vm',
					resolve: {
						Project: function(dataService, $route) {
							if ($route.current.params.id === 'new') {
								return null;
							} else {
								return dataService.getProjectById($route.current.params.id);								
							}
						},

						Settings : function(dataService){
							return dataService.getSettings();							
						}
					}
				})

				.when('/settings', {
					templateUrl: 'app/views/pages/settings.page.html',
					controller: 'Settings',
					controllerAs: 'vm',
					resolve: {
						settingsData: function(dataService) {
							return dataService.getSettings();
						}
					}
				})

				.when('/users', {
					templateUrl: 'app/views/pages/users.page.html',
					controller: 'User',
					controllerAs: 'vm',
					resolve: {
						Users : function(dataService, $rootScope) {
							$rootScope.$emit('LOAD');
							return dataService.getUsers();
						}
					}
				})

				.when('/problems', {
					templateUrl: 'app/views/pages/view-problems.page.html',
					controller: 'ViewProblem',
					controllerAs: 'vm',
					resolve: {
						Problems: function($rootScope, dataService) {
							$rootScope.$emit('LOAD');
							return dataService.getProblems();
						}
					}					

				})

				.when('/changes', {
					templateUrl: 'app/views/pages/view-changes.page.html',
					controller: 'ViewChange',
					controllerAs: 'vm',
					resolve: {
						Changes: function($rootScope, dataService) {
							$rootScope.$emit('LOAD');
							return dataService.getChanges();
						}
					}					

				})

				.when('/projects', {
					templateUrl: 'app/views/pages/view-projects.page.html',
					controller: 'ViewProject',
					controllerAs: 'vm',
					resolve: {
						Projects: function($rootScope, dataService) {
							$rootScope.$emit('LOAD');
							return dataService.getProjects();
						}
					}					
				})

				.otherwise({redirectTo : '/'});
				
	};

	function appRun($rootScope, $location, dataService, sessionService, $window) {
		$rootScope.$on('$routeChangeStart', function(event){

			dataService.getSession()
				.then(function(response){
					if (response.data.session.user) {
						sessionService.setSession(response.data.session);
						
						// Emitting sub from Nav controller.
						$rootScope.$broadcast('LOGIN', response.data.session);
					} else {
						event.preventDefault();
						$rootScope.$emit('UNLOAD');
						$location.path('/login');
					}
				})
				.catch(function(err){
					if (err.status === 401) {
						$rootScope.$emit('UNLOAD');
						$location.path('/login');
					}
				});
		});

		$rootScope.$on('$routeChangeSuccess', function(){
			if ($window.localStorage.getItem('currPath') != $location.path()) {
				$window.localStorage.setItem('prevPath', $window.localStorage.getItem('currPath'));
			}
			$window.localStorage.setItem('currPath', $location.path());
		});

	};

})();