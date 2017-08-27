var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: String,
    password: String,
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0
    },
    schlepr: {
        type: Boolean,
        default: false
    },
    admin:   {
        type: Boolean,
        default: false
    }
});

User.methods.getName = function() {
    return (this.firstname + ' ' + this.lastname);
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);