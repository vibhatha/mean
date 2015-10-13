// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	SmartPlug = mongoose.model('SmartPlug');

// Create a new error handling controller method
var getErrorMessage = function(err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Unknown server error';
	}
};

// Create a new controller method that creates new articles
exports.create = function(req, res) {
	// Create a new article object
	var smartplug = new SmartPlug(req.body);

	// Set the article's 'creator' property
	smartplug.creator = req.user;

	// Try saving the article
	smartplug.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(smartplug);
		}
	});
};

// Create a new controller method that retrieves a list of articles
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of articles
	SmartPlug.find().sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, smartplugs) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(smartplugs);
		}
	});
};

// Create a new controller method that returns an existing article
exports.read = function(req, res) {
	res.json(req.smartplug);
};

// Create a new controller method that updates an existing article
exports.update = function(req, res) {
	// Get the article from the 'request' object
	var smartplug = req.smartplug;
    //get current device name
	// Update the article fields
	smartplug.sid = req.body.sid;
	smartplug.name = req.body.name;
    smartplug.type = req.body.type;
	smartplug.devices.push(req.body.devices);
    smartplug.device = smartplug.devices[smartplug.devices.length-1].name;
	// Try saving the updated article
	smartplug.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(smartplug);
		}
	});
};

// Create a new controller method that delete an existing article
exports.delete = function(req, res) {
	// Get the article from the 'request' object
	var smartplug = req.smartplug;

	// Use the model 'remove' method to delete the article
	smartplug.remove(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(smartplug);
		}
	});
};

// Create a new controller middleware that retrieves a single existing article
exports.smartplugByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single article 
	SmartPlug.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, smartplug) {
		if (err) return next(err);
		if (!smartplug) return next(new Error('Failed to load smartpalug ' + id));

		// If an article is found use the 'request' object to pass it to the next middleware
		req.smartplug = smartplug;

		// Call the next middleware
		next();
	});
};

// Create a new controller middleware that is used to authorize an article operation 
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the article send the appropriate error message
	if (req.smartplug.creator.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	// Call the next middleware
	next();
};