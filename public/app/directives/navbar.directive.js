(function() {
    'use strict';

    angular
        .module('app.directives')
        .directive('artNavbar', artNavbar);

        function artNavbar(){
        	var directive = {
        		restrict: 'E',
        		templateUrl: 'app/views/partials/navbar.partial.html'
        	};

        	return directive;
        }

})();
