// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var	config = require('./config'),
	mongoose = require('mongoose');

// Define the Mongoose configuration method
module.exports = function() {
	// Use Mongoose to connect to MongoDB
    
    
	var db = mongoose.connect(config.db);

	// Load the application models 
	require('../app/models/user.server.model');
	require('../app/models/article.server.model');
    require('../app/models/smartplug.server.model');
    require('../app/models/device.server.model');
    require('../app/models/power.server.model');
    require('../app/models/graph.server.model');
    require('../app/models/schedule.server.model');
    require('../app/models/dashboard.server.model');
	// Return the Mongoose connection instance
	return db;
};