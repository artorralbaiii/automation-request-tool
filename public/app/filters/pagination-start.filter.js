(function(){

	angular.module('app.controller')
		.filter('startFrom', startFrom);

	//////////

	function startFrom() {
		return function(data, start) {
			start = 0 + start;
			return data.slice(start);
		}
	}

})();