(function() {
    'use strict';

    angular
        .module('app.directives')
        .directive('artNavbar', artNavbar);

        function artNavbar(){
        	var directive = {
        		restrict: 'E',
        		templateUrl: 'app/views/directive-templates/navbar.template.html',
                controller: 'Nav',
                controllerAs: 'vm'
        	};

        	return directive;
        }

})();
