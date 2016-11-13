(function(){

	'use strict';

	angular.module('app.controller')
		.controller('ViewProblem', ViewProblem);

	ViewProblem.$inject = ['$rootScope', 'Problems', 'sessionService', 'dataService', 'toastr'];

	//////////

	function ViewProblem($rootScope, Problems, sessionService, dataService, toastr) {
		var vm = this;
		
		$rootScope.$emit('UNLOAD');

		vm.searchText = '';
		vm.currentPage = 1;
		vm.pageSize = 10;
		vm.problems = Problems.data.data;
		vm.getNames = getNames;
		vm.deleteProblem = deleteProblem;
		vm.isAdmin = sessionService.getSession().admin;

		//////////

		function getNames(arr) {
			return _.pluck(arr, 'fullname').join(';');
		}

		function deleteProblem(problem) {
			
			bootbox
				 .confirm("Are you sure you want to delete \"" + problem.problemNumber + "\"?", function(result){
				 	if (result) {
		 			 	dataService.deleteDocument('problems', problem._id)
		 			 	 .then(function(response){
		 			 	 	if (response.data.err) {
		 			 	 		toastr.error(response.data.err, 'Error!');
		 			 	 		return;
		 			 	 	}

		 			 	 	vm.problems.splice(_.findIndex(vm.problems, {_id: problem._id}) ,1);
		 					toastr.success('Problem successfully deleted.', 'Deleted!');
		 			 	 })
		 			 	 .catch(function(response){
		 		 	 		toastr.error(response.data.err, 'Error!');
		 			 	 });			 		
				 	}
			});

		}


	}

})();