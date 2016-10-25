(function(){

	angular.module('app.controller')
		.controller('Home', Home);

	Home.$inject = [];

	/////////

	function Home(){

		var vm = this;
		vm.awaitingMyAction = [];
		vm.myRequests = [];

		//////////

	};

})();