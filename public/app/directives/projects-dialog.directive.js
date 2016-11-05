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
			controller: ['dataService', '$scope', '$location','ParentProject', function(dataService, $scope, $location, ParentProject){

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

			}]
		};

		return directive;
	}	 

})();