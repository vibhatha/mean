var express = require('express');
module.exports = function() {
    console.log('inside express.js');
var app = express();
require('../app/routes/index.server.routes.js')(app);
    console.log('requirement routes.js gathered');

    console.log('call app');
return app;
};