(function(){

	'use strict';

	angular.module('app.controller')
		.controller('ViewProblem', ViewProblem);

	ViewProblem.$inject = ['$rootScope', 'Problems'];

	//////////

	function ViewProblem($rootScope, Problems) {
		var vm = this;
		
		$rootScope.$emit('UNLOAD');

		vm.searchText = '';
		vm.currentPage = 1;
		vm.pageSize = 10;
		vm.problems = Problems.data.data;
		vm.getNames = getNames;

		//////////

		function getNames(arr) {
			return _.pluck(arr, 'fullname').join(';');
		}


	}

})();