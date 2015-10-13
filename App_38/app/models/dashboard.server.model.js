// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
  

// Define a new 'SmartPlugSchema'
var DashboardSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	pid: {
		type: String,
		default: '',
		trim: true,
		required: 'Did cannot be blank'
	},
	consumption: {
		type: String,
		default: '',
		trim: true
	},
      creator: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    devices:{
        type :Schema.ObjectId,
        ref:'Device'
    },
    smartplugs:{
        type :Schema.ObjectId,
        ref:'SmartPlug'
    }
});

// Create the 'Article' model out of the 'ArticleSchema'
mongoose.model('Dashboard', DashboardSchema);