// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'devices' service
angular.module('devices').factory('Devices', ['$resource', function($resource) {
	// Use the '$resource' service to return an device '$resource' object
    return $resource('api/devices/:deviceId', {
        deviceId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);