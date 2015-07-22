// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Graph = mongoose.model('Graph');

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

// Create a new controller method that creates new graphs
exports.create = function(req, res) {
	// Create a new graph object
	var graph = new Graph(req.body);

	// Set the graph's 'creator' property
	graph.creator = req.user;
   

	// Try saving the graph
	graph.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the graph 
			res.json(graph);
		}
	});
};

// Create a new controller method that retrieves a list of graphs
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of graphs
	Graph.find().sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, graphs) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the graph 
			res.json(graphs);
		}
	});
};

// Create a new controller method that returns an existing graph
exports.read = function(req, res) {
	res.json(req.graph);
};

// Create a new controller method that updates an existing graph
exports.update = function(req, res) {
	// Get the graph from the 'request' object
	var graph = req.graph;

	// Update the graph fields
	graph.title = req.body.title;
	graph.content = req.body.content;

	// Try saving the updated graph
	graph.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the graph 
			res.json(graph);
		}
	});
};

// Create a new controller method that delete an existing graph
exports.delete = function(req, res) {
	// Get the graph from the 'request' object
	var graph = req.graph;

	// Use the model 'remove' method to delete the graph
	graph.remove(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the graph 
			res.json(graph);
		}
	});
};

// Create a new controller middleware that retrieves a single existing graph
exports.graphByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single graph 
	Graph.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, graph) {
		if (err) return next(err);
		if (!graph) return next(new Error('Failed to load graph ' + id));

		// If an graph is found use the 'request' object to pass it to the next middleware
		req.graph = graph;

		// Call the next middleware
		next();
	});
};

// Create a new controller middleware that is used to authorize an graph operation 
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the graph send the appropriate error message
	if (req.graph.creator.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	// Call the next middleware
	next();
};


