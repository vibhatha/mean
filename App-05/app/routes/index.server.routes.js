module.exports = function(app) {
    console.log('inside router.js');
var index = require('../controllers/index.server.controller.js');
    console.log('controller.js');
    
app.get('/', index.render);
};