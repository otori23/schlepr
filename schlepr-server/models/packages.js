// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    comment:  {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

var placeSchema = new Schema({
    address:  {
        type: String,
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// create a schema
var packageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    from: {
        type: placeSchema,
        required: true
    },
    to: {
        type: placeSchema,
        required: true
    },
    date: {
        type: Date,
        default: Date.now 
    },
    image: {
        type: String,
        /*required: true*/
        default: "path/to/image"
    },
    detail: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: {
        type: [commentSchema],
        default: []
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Packages = mongoose.model('Package', packageSchema);

// make this available to our Node applications
module.exports = Packages;