// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
  

// Define a new 'SmartPlugSchema'
var PowerSchema = new Schema({
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
    
    time:{
        type:Date,
        default:Date.Now
    },
    	
   creator: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    device:[{
        type :Schema.ObjectId,
        ref:'Device'
    }]
});

// Create the 'Article' model out of the 'ArticleSchema'
mongoose.model('Power', PowerSchema);