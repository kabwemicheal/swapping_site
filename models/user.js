var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    fullName: String,
    username: String,
    email: String,
    phoneNumber: String,
    physicalAddress: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);