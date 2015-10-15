// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'powers' module routes
angular.module('powers').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/powers', {
			templateUrl: 'powers/views/list-powers.client.view.html'
		}).
		when('/powers/create', {
			templateUrl: 'powers/views/create-power.client.view.html'
		}).
		when('/powers/:powerId', {
			templateUrl: 'powers/views/view-power.client.view.html'
		}).
		when('/powers/:powerId/edit', {
			templateUrl: 'powers/views/edit-power.client.view.html'
		});
	}
]); 