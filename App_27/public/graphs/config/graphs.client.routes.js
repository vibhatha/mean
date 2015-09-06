// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'articles' module routes
angular.module('graphs').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/graphs', {
			templateUrl: 'graphs/views/list-graphs.client.view.html'
		}).
		when('/graphs/create', {
			templateUrl: 'graphs/views/create-graph.client.view.html'
		}).
		when('/graphs/:graphId', {
			templateUrl: 'graphs/views/view-graph.client.view.html'
		}).
		when('/graphs/:graphId/edit', {
			templateUrl: 'graphs/views/edit-graph.client.view.html'
		});
	}
]); 