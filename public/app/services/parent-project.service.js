(function(){

	'use strict';

	angular.module('app.service')
		.factory('ParentProject', ParentProject);

		//////////

		function ParentProject() {
			var project = {};

			var service = {
				getProject: getProject,
				setProject: setProject
			};

			return service;

			////////// 

			function setProject(project){
				this.project = project;
			}

			function getProject() {
				return this.project;
			}

		}

})();