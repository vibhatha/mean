// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'articles' service
angular.module('smartplugs').factory('SmartPlugs', ['$resource', function($resource) {
	// Use the '$resource' service to return an article '$resource' object
    return $resource('api/smartplugs/:smartplugId', {
        smartplugId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);