// facilityModel.js

var mongoose = require( 'mongoose' );

// Site is a campus/building/area
var siteSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
    name: String,
    notes: String
});

// Locations provide exact granulaity within sites
var locationSchema = new mongoose.Schema({

    site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site'},
    name: String,
    notes: String
});

module.exports = {
    Site: mongoose.model('Site', siteSchema),
    Location: mongoose.model('Location', locationSchema)
};

