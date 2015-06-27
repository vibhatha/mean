var connect = require('connect');
var app = connect();

var logger = function(req, res, next){

console.log('req.method === '+req.method,'req.url === '+req.url);
console.log('This is the logger');
next();
};

var demo = function(req, res, next){
 console.log('Demo Function'); 
 res.setHeader('Content-Type','text/html'); 
 res.write('<h1>Demo Function Executed</h1>'); 

};

var helloWorld = function(req,res,next){

	res.write('\n');
	res.end('<b>Hello World</b>');
};




app.use(logger);
app.use('/demo',demo);
app.use('/hello',helloWorld);
app.listen(3000);



console.log('Server running at http://localhost:3000/');