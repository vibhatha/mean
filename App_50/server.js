// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Load the module dependencies
var mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	passport = require('./config/passport'),
    intelligence = require('./config/intelligence');


// Create a new Mongoose connection instance
var db = mongoose();

// Create a new Express application instance
var app = express();

// Configure the Passport middleware
var passport = passport();

//var intelligence = intelligence();

// Use the Express application instance to listen to the '3000' port

/*
var PythonShell = require('python-shell');

//python script starts


var options = {
  mode: 'text',
  pythonPath: '/usr/bin/python3',
  pythonOptions: ['-u'],
  scriptPath: 'scripts/',
  args: []
};

PythonShell.run('svmalgo.py', options, function (err, results) {
  if (err) throw err;
  // results is an array consisting of messages collected during execution
  //console.log('results: %j', results);
  var len = results.length;
  console.log("Length : "+len);
  
	for(var i=0; i<len ; i++){
		console.log(results[i]);
	}

});
*/




//python script endsclear



////////////////////////////////////////////////////////////////

console.log('Wait...');
console.log(new Date());



app.listen(3000);



// Log the server status to the console
console.log('Server running at http://localhost:3000/');


//agenda code segment end
/////////////////////////////////////////////////////////////////////

// Use the module.exports property to expose our Express application instance for external usage
module.exports = app;


