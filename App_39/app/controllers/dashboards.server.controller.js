// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Dashboard = mongoose.model('Dashboard');

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
	var dashboard = new Dashboard(req.body);
   
    
	// Set the article's 'creator' property
	dashboard.creator = req.user;

	// Try saving the article
	dashboard.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(dashboard);
		}
	});
};

// Create a new controller method that retrieves a list of articles
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of articles
 
 console.log("Query:");
 console.log(req.query);        
	if(req.query.devices!=null){//req.query
        Dashboard.find().where('devices').equals(req.query.devices).sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, dashboards) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(dashboards);
		}
	});
 
    }//end if
    else{
        Dashboard.find().sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, dashboards) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(dashboards);
		}
	});
 
    }
    console.log('Dashboard List');
};

// Create a new controller method that returns an existing article
exports.read = function(req, res) {
   console.log('Dashboard Reader...')
    res.json(req.dashboard);
};

// Create a new controller method that updates an existing article
exports.update = function(req, res) {
	// Get the article from the 'request' object
	var dashboard = req.dashboard;
   
    
	// Update the article fields
	dashboard.pid = req.body.pid;
	dashboard.consumption = req.body.consumption;
    dashboard.devices=(req.body.devices);
    dashboard.smartplugs=(req.body.smartplugs);

	// Try saving the updated article
	dashboard.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(dashboard);
		}
	});
};

// Create a new controller method that delete an existing article
exports.delete = function(req, res) {
	// Get the article from the 'request' object
	var dashboard = req.dashboard;

	// Use the model 'remove' method to delete the article
	dashboard.remove(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(dashboard);
		}
	});
};

// Create a new controller middleware that retrieves a single existing article
exports.dashboardByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single article 
      console.log('Dashboard By Id');
	Dashboard.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, dashboard) {
		if (err) return next(err);
		if (!dashboard) return next(new Error('Failed to load dashboard ' + id));

		// If an article is found use the 'request' object to pass it to the next middleware
		req.dashboard = dashboard;

		// Call the next middleware
		next(); 
	});
};


exports.dashboardByDevice = function(req, res, next, id) {
	// Use the model 'findById' method to find a single article 
    console.log('Dashboard By Device');
	Dashboard.find().where('devices').equals('559e0c048dfa11781552c9c6').sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, dashboards) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(dashboards);
		}
	});
    
   next(); 
};



// Create a new controller middleware that is used to authorize an article operation 
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the article send the appropriate error message
	if (req.dashboard.creator.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	// Call the next middleware
	next();
};