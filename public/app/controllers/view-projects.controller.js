(function(){

	'use strict';

	angular.module('app.controller')
		.controller('ViewProject', ViewProject);

	ViewProject.$inject = ['$rootScope', 'Projects', 'ParentProject', '$location', 'sessionService', 'dataService', 'toastr'];

	//////////

	function ViewProject($rootScope, Projects, ParentProject, $location, sessionService, dataService, toastr) {
		var vm = this;

		$rootScope.$emit('UNLOAD');

		vm.searchText = '';
		vm.currentPage = 1;
		vm.pageSize = 10;
		vm.projects = Projects.data.data;
		vm.getNames = getNames;
		vm.createPR = createPR;
		vm.createCR = createCR;
		vm.deleteProject = deleteProject;
		vm.isAdmin = sessionService.getSession().admin;

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

		function deleteProject(project) {
			
			if (project.problemRequests.length > 0 || project.changeRequests.length > 0  ) {
				bootbox.alert("This project is cannot be deleted because it is linked to other request/s.");
			} else {
				bootbox
				 .confirm("Are you sure you want to delete \"" + project.applicationName + "\"?", function(result){
				 	if (result) {
		 			 	dataService.deleteDocument('projects', project._id)
		 			 	 .then(function(response){
		 			 	 	if (response.data.err) {
		 			 	 		toastr.error(response.data.err, 'Error!');
		 			 	 		return;
		 			 	 	}

		 			 	 	vm.projects.splice(_.findIndex(vm.projects, {_id: project._id}) ,1);
		 					toastr.success('Project successfully deleted.', 'Deleted!');
		 					$rootScope.$emit('REMOVE_PROJECT', project._id);
		 			 	 })
		 			 	 .catch(function(response){
		 		 	 		toastr.error(response.data.err, 'Error!');
		 			 	 });			 		
				 	}
			});

			}
		}

	}

})();