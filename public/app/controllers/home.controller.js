(function(){

	angular.module('app.controller')
		.controller('Home', Home);

	Home.$inject = [];

	/////////

	function Home(){

		var vm = this;
		vm.awaitingMyAction = [];
		vm.myRequests = [
			{
				id : 'PRB-0001',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

			},
			{
				id : 'PRB-0002',
				description: 'Sed congue dolor id posuere fermentum.'

			},
			{
				id : 'PRB-0003',
				description: 'Proin in lacus arcu. Praesent dolor nibh, egestas et lacus non, pharetra fringilla lectus.'

			}
		];

		//////////

	};

})();