// Reference the client model for things such as
// clientModel = require('./clientModel');

var facilityModel = require('./facilityModel');

var mongoose = require( 'mongoose' ); //MongoDB integration

var lockerSchema = new mongoose.Schema({
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location'},
    site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site'}, // For fewer lookups

    name:  String,
    combos: [ String ], // The first one is the active one

    rental: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental'},  // Will point to last rental
    available: Boolean, // This needs to be checked potentially every day

    notes: String
});

var rentalSchema = new mongoose.Schema({
    locker: { type: mongoose.Schema.Types.ObjectId, ref: 'Locker'},

    memberID: Number,

    firstName: String,
    lastName: String,

    email: String,
    phone: String,

    photo: String, // URL

    cost: Number,

    startDate: { type: Date, default: Date.now }, // Assigned date
    endDate: { type: Date, default: Date.now },

    notes: String
});

module.exports = {
    Site: facilityModel.Site,
    Location: facilityModel.Location,

    Locker: mongoose.model('Locker', lockerSchema),
    Rental: mongoose.model('Rental', rentalSchema)
};
