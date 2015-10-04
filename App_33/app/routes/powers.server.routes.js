// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
console.log('This is Power route');
var users = require('../../app/controllers/users.server.controller'),
	powers = require('../../app/controllers/powers.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'powers' base routes 
	app.route('/api/powers')
	   .get(powers.list)
	   .post(users.requiresLogin, powers.create);
    
   	// Set up the 'powers' parameterized routes
	app.route('/api/powers/:powerId')
	   .get(powers.read)
	   .put(users.requiresLogin, powers.hasAuthorization, powers.update)
	   .delete(users.requiresLogin, powers.hasAuthorization, powers.delete);
    app.route('/api/powers/:devices')
	   .get(powers.read)
	   .put(users.requiresLogin, powers.hasAuthorization, powers.update)
	   .delete(users.requiresLogin, powers.hasAuthorization, powers.delete);

	// Set up the 'powerId' parameter middleware   
	app.param('powerId', powers.powerByID);
    app.param('devices', powers.powerByDevice);
};