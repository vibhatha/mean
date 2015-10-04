// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'articles' module routes
angular.module('smartplugs').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/smartplugs', {
			templateUrl: 'smartplugs/views/list-smartplug.client.view.html'
		}).
		when('/smartplugs/create', {
			templateUrl: 'smartplugs/views/create-smartplug.client.view.html'
		}).
		when('/smartplugs/:smartplugId', {
			templateUrl: 'smartplugs/views/view-smartplug.client.view.html'
		}).
		when('/smartplugs/:smartplugId/edit', {
			templateUrl: 'smartplugs/views/edit-smartplug.client.view.html'
		});
	}
]);  