// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Load the module dependencies
var mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	passport = require('./config/passport');


// Create a new Mongoose connection instance
var db = mongoose();

// Create a new Express application instance
var app = express();

// Configure the Passport middleware
var passport = passport();

// Use the Express application instance to listen to the '3000' port




////////////////////////////////////////////////////////////////
//agenda code segment /* start


/* var agenda = new Agenda({db: { address: 'localhost:27017/mean-development-3'}});
var time1 ='at 10:11:14pm';
var time_slots =['at 04:00:10pm','at 04:00:20pm','at 04:00:30pm','at 04:00:40pm','at 04:00:50pm'];
var task_list =['Job 11','Job 12','Job 13','Job 14','Job 15'];


for(var i=0; i< task_list.length;i++){
  
  agenda.define(task_list[i], function(job, done) {

  console.log(new Date(), 'Job '+i);
  done();
  
  });
	
}

agenda.define('greet the world', function(job, done) {
  console.log(job.attrs.data.time, 'hello world!');
  done();
});

agenda.on('start', function(job) {
  console.log("Job : %s starting", job.attrs.npme);
});

agenda.on('complete:greet the world', function(job) {
  console.log("Job : %s finished", job.attrs.name);
});

agenda.schedule('at 08:42:36am', 'greet the world', {time: new Date()});

for(var i=0; i< task_list.length;i++){
	
	agenda.schedule(time_slots[i], task_list[i], {time: new Date()});
	
}

for(var i=0;i<task_list.length;i++){
	
	agenda.on('complete:'+task_list[i], function(job) {
	  console.log("Job : %s finished", job.attrs.name);
	});
	
}

agenda.start();
 */ 
console.log('Wait...');
console.log(new Date());



app.listen(3000);



// Log the server status to the console
console.log('Server running at http://localhost:3000/');


//agenda code segment end
/////////////////////////////////////////////////////////////////////

// Use the module.exports property to expose our Express application instance for external usage
module.exports = app;


