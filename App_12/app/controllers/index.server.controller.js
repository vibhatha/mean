// Invoke 'strict' JavaScript mode
'use strict';

// Create a new 'render' controller method
exports.render = function(req, res) {
	// Use the 'response' object to render the 'index' view with a 'title' and a stringified 'user' properties
  
    //getting the user object
    var obj = req.user;
    
    //var userM = JSON.parse(req.user);
    
   
    res.render('index', {
		title: 'Hello World',
		user: JSON.stringify(req.user),//sending json object
        user1: obj //sending user object
        
	});
};