(function(){

	'use strict';

	angular.module('app.controller')
		.controller('ViewChange', ViewChange);

	ViewChange.$inject = ['$rootScope', 'Changes'];

	//////////

	function ViewChange($rootScope, Changes) {
		var vm = this;
		
		$rootScope.$emit('UNLOAD');

		vm.searchText = '';
		vm.currentPage = 1;
		vm.pageSize = 10;
		vm.changes = Changes.data.data;
		vm.getNames = getNames;

		//////////

		function getNames(arr) {
			return _.pluck(arr, 'fullname').join(';');
		}

	}

})();