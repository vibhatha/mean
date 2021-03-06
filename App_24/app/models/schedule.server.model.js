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
		trim: true
	},
    	
    type: {
		type: String,
		default: '',
		trim: true
	},
    start: {
		type: Date
		
	},
    end: {
		type: Date
		
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
    on:{
      type: Boolean,
        default:false;    
    },
    off:{
      type: Boolean,
        default:false;    
    },
     random:{
      type: Boolean,
        default:false;    
    },
    device:{
        type :Schema.ObjectId,
        ref:'Device'
    },
    daily:{
      type: Boolean,
        default:false;    
    },
    week:{
        type:String,
        default: '',
		trim: true
    }
});

// Create the 'Article' model out of the 'ArticleSchema'
mongoose.model('Schedule', ScheduleSchema);