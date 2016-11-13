(function(){

	'use strict';

	angular.module('app.controller')
		.controller('ViewChange', ViewChange);

	ViewChange.$inject = ['$rootScope', 'Changes', 'sessionService', 'dataService', 'toastr'];

	//////////

	function ViewChange($rootScope, Changes, sessionService, dataService, toastr) {
		var vm = this;
		
		$rootScope.$emit('UNLOAD');

		vm.searchText = '';
		vm.currentPage = 1;
		vm.pageSize = 10;
		vm.changes = Changes.data.data;
		vm.getNames = getNames;
		vm.deleteChange = deleteChange;
		vm.isAdmin = sessionService.getSession().admin;

		//////////

		function getNames(arr) {
			return _.pluck(arr, 'fullname').join(';');
		}

		function deleteChange(change) {
			
			bootbox
				 .confirm("Are you sure you want to delete \"" + change.changeNumber + "\"?", function(result){
				 	if (result) {
		 			 	dataService.deleteDocument('changes', change._id)
		 			 	 .then(function(response){
		 			 	 	if (response.data.err) {
		 			 	 		toastr.error(response.data.err, 'Error!');
		 			 	 		return;
		 			 	 	}

		 			 	 	vm.changes.splice(_.findIndex(vm.changes, {_id: change._id}) ,1);
		 					toastr.success('Change successfully deleted.', 'Deleted!');
		 			 	 })
		 			 	 .catch(function(response){
		 		 	 		toastr.error(response.data.err, 'Error!');
		 			 	 });			 		
				 	}
			});

		}

	}

})();