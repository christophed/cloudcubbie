var mongoose = require( 'mongoose' ); //MongoDB integration
mongoose.connect('mongodb://localhost/cloudcubbie_dev' );

var passwordUtil = require('../utilities/password');
var model = require('../models/clientModel');

// Admin
var user = new model.User({
    firstName: 'Admin',
    lastName: 'Admin',
   
    username: 'admin',
    password: passwordUtil.hash('admin'), // Should be hashed
    isStaff:true
});

user.save( function( err ) {
    if( !err ) {
        console.log( 'Staff user created: admin/admin' );
    } 
    else {
        console.log( err );
    }
});

// Test
var client = new model.Client( {
    name: 'Stanford'
});

client.save(function( err ) {
    if ( !err ) {
        console.log('Client created: Stanford');
        var testUser = new model.User({
            
            firstName: 'Testerson',
            lastName: 'Test',
            client: client._id,
           
            username: 'test',
            password: passwordUtil.hash('test') // Should be hashed

        });

        testUser.save( function( err ) {
            if( !err ) {
                console.log( 'Staff user created: test/test' );
            } 
            else {
                console.log( err );
            }
        });
    }
    else {
        console.log ( err );
    }
});

