(function(){

	angular.module('app.controller')
		.controller('User', User);

	User.$inject = ['dataService', 'toastr', 'Users', '$rootScope'];

	//////////

	function User (dataService, toastr, Users, $rootScope){
		var vm = this;

		$rootScope.$emit('UNLOAD');

		vm.users = Users.data.users.data;
		vm.pageOffset = Users.pageOffset;
		vm.pageLimit = Users.pageLimit;
		vm.formTitle = 'New User';
		vm.showForm = false;
		vm.generalErrors = [];
		vm.toggleForm = toggleForm;

		//////////

		function getUsers(){
			dataService.getUsers(vm.pageOffset, vm.pageLimit)
			.then(function(response){
				vm.users = response.data.users.data;
			})
			.catch(function(response){
				toastr.error(response.data.err, 'Error!');
			})

		}

		function toggleForm() {
			vm.showForm = !vm.showForm;
		}

	}

})();