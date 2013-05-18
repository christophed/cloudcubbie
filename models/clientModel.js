// clientModel.js

var mongoose = require( 'mongoose' ); //MongoDB integration

var clientSchema = new mongoose.Schema({
    name: String,
    contact: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null}
});

var userSchema = new mongoose.Schema({
    
    // Affiliate info info
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
    
    // PID
    firstName: String,
    lastName: String,
    id: String, // Client-facing user ID, optional
    phone: String,
    email: String,
    notes: String,

    // Account info
    username: String,
    password: String, // Hashed
    accountType: {type: String, default: 'employee'}, // owner, master, employee
    isActive: {type: Boolean, default: true}, // active, suspended
    isStaff: {type: Boolean, default: false}
});

module.exports = {
    Client: mongoose.model('Client', clientSchema),
    User: mongoose.model('User', userSchema)
};