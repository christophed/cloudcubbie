var mongoose = require( 'mongoose' ); //MongoDB integration
mongoose.connect('mongodb://localhost/cloudcubbie_dev' );

var model = require('./models/lockerModel');

model.Locker.findOne({},function(err, locker) {
    if (err) {
        err(console.log(err)); 
    }
    else { 
        console.log(locker); }
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


//  New user
var passwordHash = require('password-hash');
var model = require('./models/clientModel');

var hash = function(password) {
    return passwordHash.generate(password, {algorithm:'sha1', saltLength:16, iterations:1000});
}

var user = new model.User({
    firstName: 'Christophe',
    lastName: 'Chong',
    id: '05486773', 
    phone: '8473122849',
    email: 'cdchong@stanford.edu',
    notes: 'Yolo',
   
    username: 'admin',
    password: hash('admin'), // Should be hashed
    isStaff:true
});

user.save( function( err ) {
    if( !err ) {
        console.log( 'new user' );
    } 
    else {
        console.log( err );
    }
});

// New site
var mongoose = require( 'mongoose' ); //MongoDB integration
mongoose.connect('mongodb://localhost/cloudcubbie_dev' );
var model = require('./models/facilityModel');
