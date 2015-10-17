// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Power = mongoose.model('Power');

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
	var power = new Power(req.body);
   
    
	// Set the article's 'creator' property
	power.creator = req.user;

	// Try saving the article
	power.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(power);
		}
	});
};

// Create a new controller method that retrieves a list of articles
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of articles
 
 console.log("Query:");
 console.log(req.query);        
	if(req.query.devices!=null){//req.query
        Power.find().where('devices').equals(req.query.devices).sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, powers) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(powers);
		}
	});
 
    }//end if
    
   else if(req.query.smartplugs!=null){//req.query
        Power.find().where('smartplugs').equals(req.query.smartplugs).sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, powers) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(powers);
		}
	});
 
    }
    else{
        Power.find().sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, powers) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(powers);
		}
	});
 
    }
    console.log('Power List');
};

// Create a new controller method that returns an existing article
exports.read = function(req, res) {
   console.log('Power Reader...')
    res.json(req.power);
};

// Create a new controller method that updates an existing article
exports.update = function(req, res) {
	// Get the article from the 'request' object
	var power = req.power;
   
    
	// Update the article fields
	power.pid = req.body.pid;
	power.consumption = req.body.consumption;
    power.devices=(req.body.devices);
    power.smartplugs=(req.body.smartplugs);

	// Try saving the updated article
	power.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(power);
		}
	});
};

// Create a new controller method that delete an existing article
exports.delete = function(req, res) {
	// Get the article from the 'request' object
	var power = req.power;

	// Use the model 'remove' method to delete the article
	power.remove(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(power);
		}
	});
};

// Create a new controller middleware that retrieves a single existing article
exports.powerByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single article 
      console.log('Power By Id');
	Power.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, power) {
		if (err) return next(err);
		if (!power) return next(new Error('Failed to load power ' + id));

		// If an article is found use the 'request' object to pass it to the next middleware
		req.power = power;

		// Call the next middleware
		next(); 
	});
};


exports.powerByDevice = function(req, res, next, id) {
	// Use the model 'findById' method to find a single article 
    console.log('Power By Device');
	Power.find().where('devices').equals('559e0c048dfa11781552c9c6').sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, powers) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(powers);
		}
	});
    
   next(); 
};



// Create a new controller middleware that is used to authorize an article operation 
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the article send the appropriate error message
	if (req.power.creator.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	// Call the next middleware
	next();
};