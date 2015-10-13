// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
console.log('This is Dashboard route');
var users = require('../../app/controllers/users.server.controller'),
	dashboards = require('../../app/controllers/dashboards.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'dashboards' base routes 
	app.route('/api/dashboards')
	   .get(dashboards.list)
	   .post(users.requiresLogin, dashboards.create);
    
   	// Set up the 'dashboards' parameterized routes
	app.route('/api/dashboards/:dashboardId')
	   .get(dashboards.read)
	   .put(users.requiresLogin, dashboards.hasAuthorization, dashboards.update)
	   .delete(users.requiresLogin, dashboards.hasAuthorization, dashboards.delete);
    app.route('/api/dashboards/:devices')
	   .get(dashboards.read)
	   .put(users.requiresLogin, dashboards.hasAuthorization, dashboards.update)
	   .delete(users.requiresLogin, dashboards.hasAuthorization, dashboards.delete);

	// Set up the 'dashboardId' parameter middleware   
	app.param('dashboardId', dashboards.dashboardByID);
    app.param('devices', dashboards.dashboardByDevice);
};