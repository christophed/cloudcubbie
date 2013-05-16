var facilityModel = require('./facilityModel');

var mongoose = require( 'mongoose' ); //MongoDB integration

var lockerSchema = new mongoose.Schema({
    
    name:  String,

    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location'},
    site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site'}, // For fewer lookups
    
    combos: [ String ], // The first one is the active one

    notes: String,

    // Current rental information
    available: {type: Boolean, default:true},
    memberID: {type: String, default:null},

    firstName: {type: String, default:null},
    lastName: {type: String, default:null},

    email: {type: String, default:null},
    phone: {type: String, default:null},

    photo: {type: String, default:null},
    cost: {type: Number, default:null},

    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },

    rentalNotes: {type: String, default:null}

});

// Storing records
var rentalSchema = new mongoose.Schema({
    locker: { type: mongoose.Schema.Types.ObjectId, ref: 'Locker'},

    memberID: String,

    firstName: String,
    lastName: String,

    email: String,
    phone: String,

    photo: String, // URL

    cost: Number,

    startDate: { type: Date, default: Date.now }, // Assigned date
    endDate: { type: Date, default: Date.now },

    rentalNotes: String
});

module.exports = {
    Site: facilityModel.Site,
    Location: facilityModel.Location,

    Locker: mongoose.model('Locker', lockerSchema),
    Rental: mongoose.model('Rental', rentalSchema)
};
