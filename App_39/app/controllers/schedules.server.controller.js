// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schedule = mongoose.model('Schedule'),
    fs = require('fs'),
    path = require("path");

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
	var schedule = new Schedule(req.body);
    var selectedSmartPlug = req.selectedSmartPlug;
    
	// Set the article's 'creator' property
	schedule.creator = req.user;
    
    
    //save data to a text file starts
    var filename ="../files/"+"demo-"+req.body.schid+"-"+new Date().toDateString()+".txt";
    var tempfilename="../files/tasklist.txt";
    var content="@@"+"{name-"+req.body.name+",timer-"+req.body.start1+",timerend-"+req.body.end1+",job-"+req.body.description
    +",action-"+"on"+",device-"+req.body.devices+",smartplug-"+req.body.smartplugs+"}"+"##\n"; //on action is made default action
    
    fs.appendFile(tempfilename, content, function(err) {
        
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
        
    }); 
    

    
    //save data to a text file ends
    
	// Try saving the article
	schedule.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(schedule);
		}
	});
};

// Create a new controller method that retrieves a list of articles
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of articles
	Schedule.find().sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, schedules) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(schedules);
		}
	});
};

// Create a new controller method that returns an existing article
exports.read = function(req, res) {
	res.json(req.schedule);
};

// Create a new controller method that updates an existing article
exports.update = function(req, res) {
	// Get the article from the 'request' object
	var schedule = req.schedule;
  //  var count = schedule.smartplugs.length;
//console.log("count of smartplugs: "+count);

	// Update the article fields
	schedule.schid = req.body.schid;
	schedule.name= req.body.name,
    schedule.type= req.body.type,
    schedule.start= req.body.start,
    schedule.end= req.body.end,
    schedule.start1= req.body.start1,
    schedule.end1= req.body.end1,
    schedule.description= req.body.description,
    schedule.switchon= req.body.switchon,
    schedule.devices= req.body.devices,
    schedule.daily= req.body.daily,
    schedule.week= req.body.week,
    schedule.smartplugs= req.body.smartplugs


	// Try saving the updated article
	schedule.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(schedule);
		}
	});
};

// Create a new controller method that delete an existing article
exports.delete = function(req, res) {
	// Get the article from the 'request' object
	var schedule = req.schedule;

	// Use the model 'remove' method to delete the article
	schedule.remove(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(schedule);
		}
	});
};

// Create a new controller middleware that retrieves a single existing article
exports.scheduleByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single article 
	Schedule.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, schedule) {
		if (err) return next(err);
		if (!schedule) return next(new Error('Failed to load schedule ' + id));

		// If an article is found use the 'request' object to pass it to the next middleware
		req.schedule = schedule;

		// Call the next middleware
		next();
	});
};

// Create a new controller middleware that is used to authorize an article operation 
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the article send the appropriate error message
	if (req.schedule.creator.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	// Call the next middleware
	next();
};