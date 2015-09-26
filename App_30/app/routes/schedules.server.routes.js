// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var users = require('../../app/controllers/users.server.controller'),
	schedules = require('../../app/controllers/schedules.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'articles' base routes 
	app.route('/api/schedules')
	   .get(schedules.list)
	   .post(users.requiresLogin, schedules.create);
	
	// Set up the 'articles' parameterized routes
	app.route('/api/schedules/:scheduleId')
	   .get(schedules.read)
	   .put(users.requiresLogin, schedules.hasAuthorization, schedules.update)
	   .delete(users.requiresLogin, schedules.hasAuthorization, schedules.delete);

	// Set up the 'articleId' parameter middleware   
	app.param('scheduleId', schedules.scheduleByID);
};