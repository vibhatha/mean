// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Device = mongoose.model('Device');

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
	var device = new Device(req.body);
    var selectedSmartPlug = req.selectedSmartPlug;
    console.log("Selected Smart Plug: "+selectedSmartPlug);
    console.log("smart plug: "+device.smartplugs);
    console.log("name of device:" +device.name);


	// Set the article's 'creator' property
	device.creator = req.user;

	// Try saving the article
	device.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(device);
		}
	});
};

// Create a new controller method that retrieves a list of articles
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of articles
	Device.find().sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, devices) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(devices);
		}
	});
};

// Create a new controller method that returns an existing article
exports.read = function(req, res) {
	res.json(req.device);
};

// Create a new controller method that updates an existing article
exports.update = function(req, res) {
	// Get the article from the 'request' object
	var device = req.device;
    var count = device.smartplugs.length;
    console.log("count of smartplugs: "+count);

	// Update the article fields
	device.sid = req.body.sid;
	device.name = req.body.name;
    device.type = req.body.type;
	device.device = req.body.device;
    device.smartplugs.push(req.body.smartplugs);

	// Try saving the updated article
	device.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(device);
		}
	});
};

// Create a new controller method that delete an existing article
exports.delete = function(req, res) {
	// Get the article from the 'request' object
	var device = req.device;

	// Use the model 'remove' method to delete the article
	device.remove(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(device);
		}
	});
};

// Create a new controller middleware that retrieves a single existing article
exports.deviceByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single article 
	Device.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, device) {
		if (err) return next(err);
		if (!device) return next(new Error('Failed to load device ' + id));

		// If an article is found use the 'request' object to pass it to the next middleware
		req.device = device;

		// Call the next middleware
		next();
	});
};

// Create a new controller middleware that is used to authorize an article operation 
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the article send the appropriate error message
	if (req.device.creator.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	// Call the next middleware
	next();
};