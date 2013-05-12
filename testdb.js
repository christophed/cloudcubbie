var mongoose = require( 'mongoose' ); //MongoDB integration
mongoose.connect('mongodb://localhost/cloudcubbie_dev' );

var model = require('./models/lockerModel');

model.Locker.findOne({},function(err, locker) {
    if (err) {
        err(console.log(err)); 
    }
    else { 
        console.log(locker.available); }
    }
);

model.Location.findById('51665f540c7c9f67ed000001', function(err, location) {console.log(location);})

model.Rental.findOne({}, function(err, rental) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(rental);    
    }
});