(function(){

	angular.module('app.service')
		.factory('sessionService', sessionService);

		sessionService.$inject = ['$window'];

		//////////

		function sessionService($window){
			var service = {
				setSession: setSession,
				getSession: getSession
			}

			return service;

			function setSession(data) {
				if (data) {
					$window.localStorage.setItem('art.session',data);
				} else {
					$window.localStorage.removeItem('art.session');					
				}
			}

			function getSession() {
				return JSON.parse($window.localStorage.getItem('art.session'));
			}
		}

})();