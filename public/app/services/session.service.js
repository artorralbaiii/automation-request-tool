(function(){

	angular.module('app.service')
		.factory('sessionService', sessionService);

		//////////

		function sessionService($window){
			var currentSession = {};

			var service = {
				setSession: setSession,
				getSession: getSession
			}

			return service;

			function setSession(user) {
				this.currentSession = user;
			}

			function getSession() {
				return this.currentSession;
			}
		}

})();