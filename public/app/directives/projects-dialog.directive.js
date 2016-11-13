(function(){

	'use strict';

	angular.module('app.directive')
		.directive('artProjectsDialog', artProjectsDialog);

	//////////

	function artProjectsDialog(){
		var directive = {

			restrict: 'E',
			templateUrl: 'app/views/directive-templates/projects-dialog.template.html',
			scope: {
				dialog_title: '=',
				dialog_resource: '='
			},
			controller: ['dataService', '$scope', '$location','ParentProject', '$rootScope', 
			function(dataService, $scope, $location, ParentProject, $rootScope){

				$scope.projects = [];
				$scope.searchText = '';
				$scope.currentPage = 1;
				$scope.pageSize = 5;
				$scope.newRequest = newRequest;

				activate()
	
				//////////

				function activate(){
					getProjects();
				}

				function getProjects(){
					dataService.getProjects()
					.then(function(response){
						$scope.projects = response.data.data;
					});
				}

				function newRequest(project) {
					ParentProject.setProject(project);		
					$location.path('/' + $scope.$parent.vm.dialogResource + '/new');			
				}

				$rootScope.$on('APPEND_PROJECT', function(event, data){
					$scope.searchText = '';
					$scope.currentPage = 1;
					$scope.pageSize = 5;
					$scope.projects.push(data);
				});

				$rootScope.$on('REMOVE_PROJECT', function(event, data){
					$scope.searchText = '';
					$scope.currentPage = 1;
					$scope.pageSize = 5;
					$scope.projects.splice(_.findIndex($scope.projects, {_id: data}) ,1);
				});

			}]
		};

		return directive;
	}	 

})();