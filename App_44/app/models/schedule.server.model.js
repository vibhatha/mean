// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
  

// Define a new 'SmartPlugSchema'
var ScheduleSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	schid: {
		type: String,
		default: '',
		trim: true,
		required: 'Schid cannot be blank'
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
    	
    type: {
		type: String,
		default: '',
		trim: true
	},
    start: {
		type: Date,
		required: 'Please Enter a Date',
        default:new Date()
		
	},
    end: {
		type: Date,
		required: 'Please Enter a Date',
        default:new Date()
		
	},
     start1: {
		type: String,
		required: 'Please Enter a Date'
		
	},
    end1: {
		type: String,
		required: 'Please Enter a Date'
		
	},
    
    description: {
		type: String,
		default: '',
		trim: true
	},
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    switchon:{
      type: Boolean,
        default:false 
    },
    random:{
      type: Boolean,
        default:false 
    },
    devices:{
        type :Schema.ObjectId,
        ref:'Device'
    },
     smartplugs:{
        type :Schema.ObjectId,
        ref:'SmartPlug'
    },
    daily:{
      type: Boolean,
        default:false  
    },
    week:{
        type:String,
        default: '',
		trim: true
    }
    
});

// Create the 'Article' model out of the 'ArticleSchema'
mongoose.model('Schedule', ScheduleSchema);