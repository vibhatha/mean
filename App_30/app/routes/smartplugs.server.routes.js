// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var users = require('../../app/controllers/users.server.controller'),
	smartplugs = require('../../app/controllers/smartplugs.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'articles' base routes 
	app.route('/api/smartplugs')
	   .get(smartplugs.list)
	   .post(users.requiresLogin, smartplugs.create);
	
	// Set up the 'articles' parameterized routes
	app.route('/api/smartplugs/:smartplugId')
	   .get(smartplugs.read)
	   .put(users.requiresLogin, smartplugs.hasAuthorization, smartplugs.update)
	   .delete(users.requiresLogin, smartplugs.hasAuthorization, smartplugs.delete);

	// Set up the 'articleId' parameter middleware   
	app.param('smartplugId', smartplugs.smartplugByID);
};