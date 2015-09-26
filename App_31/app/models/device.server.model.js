// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
  

// Define a new 'SmartPlugSchema'
var DeviceSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	did: {
		type: String,
		default: '',
		trim: true,
		required: 'Did cannot be blank'
	},
	name: {
		type: String,
		default: '',
		trim: true
	},
    	
    type: {
		type: String,
		default: '',
		trim: true
	},
    model: {
		type: String,
		default: '',
		trim: true
	},
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    smartplugs:[{
        type :Schema.ObjectId,
        ref:'SmartPlug'
    }]
});

// Create the 'Article' model out of the 'ArticleSchema'
mongoose.model('Device', DeviceSchema);