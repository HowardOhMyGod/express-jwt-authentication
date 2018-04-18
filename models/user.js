const config = require('../config');
var mongoose = require('mongoose');

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

mongoose.connect(config.db);
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// create use schema
var userSchema = new mongoose.Schema({
    user: String,
    pwd: String,
    role: String,
    name: String
});

module.exports = mongoose.model('User', userSchema);
