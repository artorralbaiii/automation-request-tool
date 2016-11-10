(function(){

	'use strict';

	angular.module('app.controller')
		.controller('ViewProject', ViewProject);

	ViewProject.$inject = ['$rootScope', 'Projects', 'ParentProject', '$location'];

	//////////

	function ViewProject($rootScope, Projects, ParentProject, $location) {
		var vm = this;

		$rootScope.$emit('UNLOAD');

		vm.searchText = '';
		vm.currentPage = 1;
		vm.pageSize = 10;
		vm.projects = Projects.data.data;
		vm.getNames = getNames;
		vm.createPR = createPR;
		vm.createCR = createCR;

		////////// 

		function getNames(arr) {
			return _.pluck(arr, 'fullname').join(';');
		}

		function createPR(project) {
			ParentProject.setProject(project);
			$location.path('/problem/new');
		}

		function createCR(project) {
			ParentProject.setProject(project);
			$location.path('/change/new');
		}

	}

})();