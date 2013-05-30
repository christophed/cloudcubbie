var mongoose = require( 'mongoose' ); //MongoDB integration
mongoose.connect('mongodb://localhost/cloudcubbie_dev' );

var passwordUtil = require('../utilities/password');
var model = require('../models/clientModel');
var memberModel = require('../models/memberModel');

mongoose.connection.db.dropDatabase(function(err) {
    if ( err ) {
        console.log(err);
    }
    else {
        console.log('Database reset');
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
            name: 'TestClient'
        });

        client.save(function( err ) {
            if ( !err ) {
                // Test User
                console.log('Client created: TestClient');
                var testUser = new model.User({
                    
                    firstName: 'John',
                    lastName: 'Doe',
                    client: client._id,
                   
                    username: 'test',
                    password: passwordUtil.hash('test') // Should be hashed

                });

                testUser.save( function( err ) {
                    if( !err ) {
                        console.log( 'Test user created: test/test' );
                    } 
                    else {
                        console.log( err );
                    }
                });

                // Members
                var members = [{
                        memberID: '01234567',
                        firstName: 'Tom',
                        lastName: 'Son',
                        email: 'tomson@stanford.edu',
                        phone: '4081234567',
                        client: client._id
                    }, 
                    {
                        memberID: '02345678',
                        firstName: 'Jane',
                        lastName: 'Jameson',
                        email: 'jameson@stanford.edu',
                        phone: '4082345678',
                        client: client._id
                    },
                    {
                        memberID: '03456789',
                        firstName: 'James',
                        lastName: 'Janeson',
                        email: 'janeson@stanford.edu',
                        phone: '6503456789',
                        client: client._id
                    },
                    {
                        memberID: '00',
                        firstName: 'James',
                        lastName: 'Janeson',
                        email: 'janeson@stanford.edu',
                        phone: '6503456789',
                        client: client._id
                    },
                    {
                        memberID: '01',
                        firstName: 'James',
                        lastName: 'Bond',
                        email: 'bond@stanford.edu',
                        phone: '6509876543',
                        client: client._id
                    },
                    {
                        memberID: '02',
                        firstName: 'Ian',
                        lastName: 'Flemming',
                        email: 'flemming@stanford.edu',
                        phone: '6502234567',
                        client: client._id
                    },
                    {
                        memberID: '03',
                        firstName: 'Paul',
                        lastName: 'McCartney',
                        email: 'mccartney@stanford.edu',
                        phone: '6503456789',
                        client: client._id
                    },
                    {
                        memberID: '04',
                        firstName: 'James',
                        lastName: 'Patterson',
                        email: 'patterson@stanford.edu',
                        phone: '6503234567',
                        client: client._id
                    },
                    {
                        memberID: '05',
                        firstName: 'John',
                        lastName: 'Grisham',
                        email: 'grisham@stanford.edu',
                        phone: '6504234567',
                        client: client._id
                    },
                    {
                        memberID: '06',
                        firstName: 'James',
                        lastName: 'Conant',
                        email: 'conant@stanford.edu',
                        phone: '6505234567',
                        client: client._id
                    },
                    {
                        memberID: '07',
                        firstName: 'David',
                        lastName: 'Wallace',
                        email: 'wallace@stanford.edu',
                        phone: '6506234567',
                        client: client._id
                    },
                    {
                        memberID: '08',
                        firstName: 'Tracy',
                        lastName: 'Austin',
                        email: 'austin@stanford.edu',
                        phone: '6507234567',
                        client: client._id
                    },
                    {
                        memberID: '09',
                        firstName: 'James',
                        lastName: 'Gatsby',
                        email: 'gatsby@stanford.edu',
                        phone: '6508234567',
                        client: client._id
                    }
                ];

                for (var i = 0; i < members.length; i++) {
                    var member = new memberModel.Member(members[i]);

                    member.save( function( err ) {
                        if( !err ) {
                            console.log( 'Member created: ' + member.memberID );
                        } 
                        else {
                            console.log( err );
                        }
                    });
                }

            }
            else {
                console.log ( err );
            }
        });


    }
});