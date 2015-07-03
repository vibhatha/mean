// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'development' environment configuration object
module.exports = {
db: 'mongodb://localhost/mean-development-1',
sessionSecret: 'developmentSessionSecret',
facebook: {
clientID: '1012919578720198',
clientSecret: 'c25d17e7ff4f1d5d09ca4093c3dc4b2d',
callbackURL: 'http://localhost:3000/oauth/facebook/callback'
}
};
