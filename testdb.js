var mongoose = require( 'mongoose' ); //MongoDB integration
mongoose.connect('mongodb://localhost/cloudcubbie_dev' );

var model = require('./models/lockerModel');

model.Location.findById('51665f540c7c9f67ed000001', function(err, location) {console.log(location);})