(function(){

	angular.module('app.controller')
		.controller('Home', Home);

	Home.$inject = ['Project', '$rootScope'];

	/////////

	function Home(Project, $rootScope){

		$rootScope.$emit('UNLOAD');

		var vm = this;
		vm.awaitingMyAction = [];
		vm.myRequests = [];
		vm.projects = Project.data.data;

		//////////




	};

})();