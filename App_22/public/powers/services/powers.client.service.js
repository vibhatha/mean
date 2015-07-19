// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'powers' service
angular.module('powers').factory('Powers', ['$resource', function($resource) {
	// Use the '$resource' service to return an power '$resource' object
    return $resource('api/powers?devices/:devices', {
        powerId: '@_id',
        devices: '@devices'
       
       
    },{
        update: {
            method: 'PUT'
        }
    });
}]);