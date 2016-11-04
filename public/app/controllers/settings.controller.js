(function(){

	'use strict';

	angular.module('app.controller')
		.controller('Settings', Settings);

	Settings.$inject = ['settingsData', 'dataService', 'toastr'];

	//////////

	function Settings(settingsData, dataService, toastr) {
		var vm = this;

		vm.formData = settingsData.data.data;
		vm.users = [];
		vm.pullUsers = pullUsers;
		vm.submit = submit;

		////////// 

		function pullUsers(qry) {
			dataService.getUsersByKey(qry)
			 .then(function(response){
				vm.users = response.data.data;			 	
			})
			 .catch(function(response){
			 	toastr.error('Error!', 'Unable to fetch users. Error >> ' + response.data.err);
			});
		}

		function submit() {
			var data = _.clone(vm.formData);

			data.technicalLeads = _.pluck(data.technicalLeads, '_id');
			data.serviceLineLeads = _.pluck(data.serviceLineLeads, '_id');
			data.developers = _.pluck(data.developers, '_id');
			data.supports = _.pluck(data.supports, '_id');

			if (data._id) {
				dataService.updateSettings(data)
				.then(function(response){
					toastr.success('Success!', 'Settings successfully updated.')
				})
				.catch(function(response){
					toastr.error('Error!', response.data.err);
				});
			} else {
				dataService.createSettings(data)
				.then(function(response){
					toastr.success('Success!', 'Settings successfully updated.')
				})
				.catch(function(response){
					toastr.error('Error!', response.data.err);
				});
			}

		}


	}

})();