// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'devices' module routes
angular.module('devices').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/devices', {
			templateUrl: 'devices/views/list-devices.client.view.html'
		}).
		when('/devices/create', {
			templateUrl: 'devices/views/create-device.client.view.html'
		}).
		when('/devices/:deviceId', {
			templateUrl: 'devices/views/view-device.client.view.html'
		}).
		when('/devices/:deviceId/edit', {
			templateUrl: 'devices/views/edit-device.client.view.html'
		});
	}
]); 