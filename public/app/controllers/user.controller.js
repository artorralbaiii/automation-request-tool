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
		vm.generalErrors = [];
		vm.formData = {};
		vm.buttonLabel = { submit: 'Submit', cancel: 'Clear'};
		vm.editUser = editUser;
		vm.submit = submit;

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

		function editUser(user) {
			vm.formData.fullname = user.fullname;
			vm.formData.email = user.email;
			vm.formData.admin = user.admin;

			vm.buttonLabel = {
				submit: 'Update',
				cancel: 'Cancel'
			}		
		}

		function submit(frm) {

			if (frm.$valid) {

			}

		}

		function validate(fld, frm) {

			if (frm[fld].$dirty && frm.$submitted) {

			}

		}

	}

})();