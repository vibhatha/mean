// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'articles' service
angular.module('graphs').factory('Graphs', ['$resource', function($resource) {
	// Use the '$resource' service to return an article '$resource' object
    return $resource('api/graphs/:graphId', {
        articleId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);