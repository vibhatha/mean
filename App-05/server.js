var express = require('./config/express');
console.log('read .config/express');
var app = express();
console.log('express()');
app.listen(3000);
console.log('listen 3000');
module.exports = app;
console.log('Server running at http://localhost:3000/');