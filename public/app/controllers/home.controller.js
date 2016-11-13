(function(){

	angular.module('app.controller')
		.controller('Home', Home);

	Home.$inject = ['$scope', 'Project', 'dataService', '$rootScope', 'toastr', '$location', 'ParentProject', 'RelatedRequests'];

	/////////

	function Home($scope, Project, dataService, $rootScope, toastr, $location, ParentProject, RelatedRequests){

		$rootScope.$emit('UNLOAD');

		var vm = this;
		vm.projects = Project.data.projects.data;
		vm.recordCount = Project.data.projects.count;
		vm.recordFetchCount = Project.data.projects.data.length;
		vm.relatedRequests = RelatedRequests.data.data;
		vm.offset = 0;
		vm.limit = 5;
		vm.searchText = '';
		vm.showLoadMore = showLoadMore;
		vm.loadMoreProjects = loadMoreProjects;
		vm.reloadProjects = reloadProjects;
		vm.newRequest = newRequest;
		vm.editRequest = editRequest;
		vm.searching = false;
		vm.setResource = setResource;

		//////////

		function loadMoreProjects() {
			vm.offset += vm.limit;
			$rootScope.$emit('LOAD');

			dataService.getProjectsByPage(vm.offset, vm.limit, vm.searchText)
			.then(function(response){

				if (vm.recordCount != response.data.projects.count) {
					reloadProjects();
				} else {
					Array.prototype.push.apply(vm.projects, response.data.projects.data);
					vm.recordFetchCount = response.data.projects.data.length;
					$rootScope.$emit('UNLOAD');
				}

			})
			.catch(function(response){
				toastr.error('Error!', response.data.err);
				$rootScope.$emit('UNLOAD');
			});

		}

		function newRequest(resource, project) {
			ParentProject.setProject(project);
			$location.path('/' + resource + '/new');
		}

		function editRequest(project, resource, id) {
			ParentProject.setProject(project);
			$location.path('/' + resource + '/' + id);			
		}

		function reloadProjects(){
			vm.searching = true;
			dataService.getProjectsByPage(0, vm.offset + vm.limit, vm.searchText) 
			.then(function(response){
				vm.projects = response.data.projects.data;
				vm.recordCount = response.data.projects.count;
				vm.recordFetchCount = response.data.projects.data.length;
				$rootScope.$emit('UNLOAD');
				vm.searching = false;
			})
			.catch(function(response){
				toastr.error('Error!', response.data.err);
				$rootScope.$emit('UNLOAD');
				vm.searching = false;
			});
		} 

		function showLoadMore() {

			return ( 
					 (vm.recordCount > vm.limit + vm.offset) && 
				     (vm.recordFetchCount == vm.limit) 
				     ? true : false 
				   );
		}

		function setResource(resource, title){
			$scope.$parent.vm.setResource(resource, title);
		}

	};

})();