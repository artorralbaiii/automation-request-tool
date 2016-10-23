(function(){

	angular.module('app.controller')
		.controller('User', User);

	User.$inject = ['dataService', 'toastr', 'Users', '$rootScope'];

	//////////

	function User (dataService, toastr, Users, $rootScope){
		var vm = this;

		$rootScope.$emit('UNLOAD');

		vm.users = Users.data.data;
		vm.currentPage = 1;
		vm.pageSize = 5;
		vm.searchText = '';
		vm.generalErrors = [];
		vm.formData = {};
		vm.buttonLabel = { submit: 'Submit', cancel: 'Clear'};
		vm.editUser = editUser;
		vm.submit = submit;
		vm.validate = validate;
		vm.validation = {};
		vm.resetForm = resetForm;
		vm.deleteUser = deleteUser;

		//////////

		function getUsers(){
			dataService.getUsers()
			.then(function(response){
				vm.users = response.data.data;
			})
			.catch(function(response){
				toastr.error(response.data.err, 'Error!');
			})
		}

		function editUser(user, index) {
			vm.formData._id = user._id;
			vm.formData.fullname = user.fullname;
			vm.formData.email = user.email;
			vm.formData.admin = user.admin;
			vm.buttonLabel = { submit: 'Update', cancel: 'Cancel' }		
			vm.deleteUser = deleteUser;
		}

		function resetForm(frm) {
			vm.formData = {};
			frm.$setPristine();		
			vm.buttonLabel = { submit: 'Submit', cancel: 'Clear'};
		}

		function submit(frm) {
			vm.generalErrors = [];

			if (frm.$valid) {
				if (vm.buttonLabel.submit === 'Submit') {
					dataService.createUser(vm.formData)
					.then(function(response){
						if (response.data.err) {
							vm.generalErrors.push(response.data.err);	
							return;
						}
						toastr.success('New user sucessfully created.', 'Success!');
						vm.users.push(response.data.data);
						resetForm(frm);
					})
					.catch(function(response){
						vm.generalErrors.push(response.data.err);	
					});
				} else {					
					dataService.updateUser(vm.formData)
					.then(function(response){						
						if (response.data.err) {
							vm.generalErrors.push(response.data.err);	
							return;
						}

						vm.users[_.findIndex(vm.users, {_id: response.data.data._id})] = response.data.data;
						toastr.success('User successfully updated.', 'Success!');
						resetForm(frm);
					})
					.catch(function(response){
						vm.generalErrors.push(response.data.err);	
					});
				}
			}

		}

		function deleteUser(id, name, index) {
			bootbox
			 .confirm("Are you sure you want to delete \"" + name + "\"?", function(result){
			 	if (result) {
				 	dataService.deleteDocument('users', id)
				 	 .then(function(response){
				 	 	if (response.data.err) {
				 	 		toastr.error(response.data.err, 'Error!');
				 	 		return;
				 	 	}

				 	 	console.log(id);
				 	 	console.log(vm.users.indexOf(id));

				 	 	vm.users.splice(_.findIndex(vm.users, {_id: id}) ,1);
						toastr.success('User successfully deleted.', 'Deleted!');
				 	 })
				 	 .catch(function(response){
			 	 		toastr.error(response.data.err, 'Error!');
				 	 });			 		
			 	}
			});
		}

		function validate(fld, frm) {

			var fldName = {
				'fullname' : 'Name',
				'email': 'Email'
			}

			if (frm[fld].$dirty || frm.$submitted) {
				if (frm[fld].$error.required) {
					vm.validation[fld] = 'Please enter ' + fldName[fld]  + '.';
					return true;
				} else if (frm[fld].$invalid) {
					vm.validation[fld] = 'Please enter a valid ' + fldName[fld]  + '.';					
					return true;					
				}
			}

			return false;

		}

	}

})();