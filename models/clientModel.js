// clientModel.js

var mongoose = require( 'mongoose' ); //MongoDB integration

var clientSchema = new mongoose.Schema({
    name: String,
    contact: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

var userSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
    firstName: String,
    lastName: String,
    id: String, // Client-facing user ID, optional
    phone: String,
    email: String,
    notes: String,

    username:String,
    password: String // Should be hashed
});

module.exports = {
    Client: mongoose.model('Client', clientSchema),
    User: mongoose.model('User', userSchema)
};