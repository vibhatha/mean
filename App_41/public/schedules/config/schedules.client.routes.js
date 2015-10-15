// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'schedules' module routes
angular.module('schedules').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/schedules', {
			templateUrl: 'schedules/views/list-schedules.client.view.html'
		}).
		when('/schedules/create', {
			templateUrl: 'schedules/views/create-schedule.client.view.html'
		}).
		when('/schedules/:scheduleId', {
			templateUrl: 'schedules/views/view-schedule.client.view.html'
		}).
		when('/schedules/:scheduleId/edit', {
			templateUrl: 'schedules/views/edit-schedule.client.view.html'
		});
	}
]); 