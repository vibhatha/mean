// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Define a new 'SmartPlugSchema'
var SmartPlugSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	sid: {
		type: String,
		default: '',
		trim: true,
		required: 'Sid cannot be blank'
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
    device: {
		type: String,
		default: '',
		trim: true
	},
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    devices:[
        {type :Schema.ObjectId,
        ref:'Device'
        }]
});

// Create the 'Article' model out of the 'ArticleSchema'
mongoose.model('SmartPlug', SmartPlugSchema);