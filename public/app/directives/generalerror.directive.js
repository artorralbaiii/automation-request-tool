(function(){

	angular.module('app.directive')
		.directive('generalError', generalError);


		//////////

		function generalError(){
			var directive = {
				restrict: 'E',
				templateUrl: 'app/views/directive-templates/generalerror.template.html',
				scope: {
					errors: '='
				}
			}
			
			return directive;
		}

})();