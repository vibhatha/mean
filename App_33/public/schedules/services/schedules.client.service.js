// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'schedules' service
angular.module('schedules').factory('Schedules', ['$resource', function($resource) {
	// Use the '$resource' service to return an schedule '$resource' object
    return $resource('api/schedules/:scheduleId', {
        scheduleId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);