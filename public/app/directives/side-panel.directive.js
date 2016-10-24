(function(){
	'use strict';

	angular
		.module('app.directive')
	 	.directive('artSidePanel', artSidePanel);

	 //////////

	 function artSidePanel() {

	 	var directive = {
	 		restrict: 'E',
	 		templateUrl: 'app/views/directive-templates/sidepanel.template.html',	 	
	 		scope: {
	 			title: '=',
	 			items: '='
	 		}	
	 	}

	 	return directive;
	 }

})();