// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var users = require('../../app/controllers/users.server.controller'),
	graphs = require('../../app/controllers/graphs.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'graphs' base routes 
	app.route('/api/graphs')
	   .get(graphs.list)
	   .post(users.requiresLogin, graphs.create);
	
	// Set up the 'graphs' parameterized routes
	app.route('/api/graphs/:graphId')
	   .get(graphs.read)
	   .put(users.requiresLogin, graphs.hasAuthorization, graphs.update)
	   .delete(users.requiresLogin, graphs.hasAuthorization, graphs.delete);

	// Set up the 'graphId' parameter middleware   
	app.param('graphId', graphs.graphByID);
};