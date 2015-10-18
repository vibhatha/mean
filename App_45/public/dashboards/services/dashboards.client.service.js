// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'dashboards' service
angular.module('dashboards').factory('Dashboards', ['$resource', function($resource) {
	// Use the '$resource' service to return an dashboard '$resource' object
    return $resource('api/dashboards/:dashboardId', {
        dashboardId: '@_id',
        devices: '@devices'
       
       
    },{
        update: {
            method: 'PUT'
        }
    });
}]);



