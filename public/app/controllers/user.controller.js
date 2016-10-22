(function(){

	angular.module('app.controller')
		.controller('User', User);

	User.$inject = ['dataService', 'toastr', 'Users', '$rootScope'];

	//////////

	function User (dataService, toastr, Users, $rootScope){
		var vm = this;
		$rootScope.$emit('UNLOAD');
		console.log('User controller');

		vm.users = Users.data.data.data
		vm.pageOffset = Users.pageOffset;
		vm.pageLimit = Users.pageLimit;

		//////////

		function getUsers(){
			dataService.getUsers(vm.pageOffset, vm.pageLimit)
			.then(function(response){
				vm.users = response.data.data.data;
			})
			.catch(function(response){
				toastr.error(response.data.err, 'Error!');
			})

		}

	}

})();