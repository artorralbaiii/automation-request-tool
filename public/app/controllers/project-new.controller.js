(function(){

	'use strict'

	angular.module('app.controller')
		.controller('ProjectNew', ProjectNew);


	//////////

	function ProjectNew() {
		var vm = this;
		vm.formData = {};
		vm.formData.deployed = false;
		vm.formData.businessOwners = [{"fullname":"Andres Jr III Torralba","email":"torralaj@ph.ibm.com"}];
		vm.submit = submit;
		vm.users = [
			{
				fullname: 'Andres Jr III Torralba',
				email: 'torralaj@ph.ibm.com'
			},
			{
				fullname: 'Czarlyn Torralba',
				email: 'czarlyn@ph.ibm.com'
			},
			{
				fullname: 'Edna Torralba',
				email: 'edna@ph.ibm.com'
			}
		];


		//////////

		function submit(frm) {

		}
		
	}

})();