(function(){

	angular.module('app.controller')
		.controller('Home', Home);

	Home.$inject = ['Project', 'dataService', '$rootScope', 'toastr', '$location', 'ParentProject'];

	/////////

	function Home(Project, dataService, $rootScope, toastr, $location, ParentProject){

		$rootScope.$emit('UNLOAD');

		var vm = this;
		vm.awaitingMyAction = [];
		vm.myRequests = [];
		vm.projects = Project.data.projects.data;
		vm.recordCount = Project.data.projects.count;
		vm.recordFetchCount = Project.data.projects.data.length;
		vm.offset = 0;
		vm.limit = 5;
		vm.searchText = '';
		vm.showLoadMore = showLoadMore;
		vm.loadMoreProjects = loadMoreProjects;
		vm.reloadProjects = reloadProjects;
		vm.newProblem = newProblem;
		vm.searching = false;

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

		function newProblem(project) {
			ParentProject.setProject(project);
			$location.path('/problem/' + project._id + '/new');
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

	};

})();