// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
console.log('This is Device route');
var users = require('../../app/controllers/users.server.controller'),
	devices = require('../../app/controllers/devices.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'devices' base routes 
	app.route('/api/devices')
	   .get(devices.list)
	   .post(users.requiresLogin, devices.create);
	
	// Set up the 'devices' parameterized routes
	app.route('/api/devices/:deviceId')
	   .get(devices.read)
	   .put(users.requiresLogin, devices.hasAuthorization, devices.update)
	   .delete(users.requiresLogin, devices.hasAuthorization, devices.delete);

	// Set up the 'deviceId' parameter middleware   
	app.param('deviceId', devices.deviceByID);
};