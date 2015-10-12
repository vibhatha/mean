// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'dashboards' module routes
angular.module('dashboards').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/dashboards', {
			templateUrl: 'dashboards/views/list-dashboards.client.view.html'
		}).
        when('/dashboards/popups', {
			templateUrl: 'dashboards/views/popupTmpl.html'
		}).
		when('/dashboards/create', {
			templateUrl: 'dashboards/views/create-dashboard.client.view.html'
		}).
		when('/dashboards/:dashboardId', {
			templateUrl: 'dashboards/views/view-dashboard.client.view.html'
		}).
		when('/dashboards/:dashboardId/edit', {
			templateUrl: 'dashboards/views/edit-dashboard.client.view.html'
		});
	}
]); 