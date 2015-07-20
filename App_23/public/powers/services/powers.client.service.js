// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'powers' service
angular.module('powers').factory('Powers', ['$resource', function($resource) {
	// Use the '$resource' service to return an power '$resource' object
    return $resource('api/powers/:powerId', {
        powerId: '@_id',
        devices: '@devices'
       
       
    },{
        update: {
            method: 'PUT'
        }
    });
}]);



